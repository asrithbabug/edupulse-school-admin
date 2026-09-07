'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon } from '@heroicons/react/24/outline';
import Modal from '@/components/Modal';
import LoadingSpinner from '@/components/LoadingSpinner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://13.126.4.16';
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];
const CLASSES = ['10-A', '10-B', '9-A', '9-B', '8-A', '8-B', '7-A', '7-B'];

export default function TimetablePage() {
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [slotForm, setSlotForm] = useState({ day: 1, period: 1, subject: '', teacher: '' });
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    fetchTimetable();
    fetchSubjectsAndTeachers();
  }, [selectedClass]);

  async function fetchTimetable() {
    setLoading(true);
    try {
      const token = localStorage.getItem('edupulse_token');
      const res = await fetch(`${API_URL}/api/timetable/${selectedClass}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch timetable');
      const data = await res.json();
      setTimetable(data.timetable || data.data || {});
    } catch (err) {
      console.warn('Failed to fetch timetable:', err.message);
      setTimetable({});
    }
    setLoading(false);
  }

  async function fetchSubjectsAndTeachers() {
    try {
      const token = localStorage.getItem('edupulse_token');
      const [subRes, tchRes] = await Promise.all([
        fetch(`${API_URL}/api/subjects`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/admin/teachers`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (subRes.ok) {
        const subData = await subRes.json();
        setSubjects(subData.data || subData || []);
      }
      if (tchRes.ok) {
        const tchData = await tchRes.json();
        setTeachers(tchData.data || tchData || []);
      }
    } catch (err) {
      console.warn('Failed to fetch subjects/teachers:', err.message);
    }
  }

  function getSlot(day, period) {
    const daySlots = timetable[day] || timetable[String(day)] || [];
    if (Array.isArray(daySlots)) {
      return daySlots.find((s) => s.period === period || s.period === String(period));
    }
    return null;
  }

  function openSlotModal(dayIndex, period) {
    const existing = getSlot(dayIndex + 1, period);
    setSlotForm({
      day: dayIndex + 1,
      period,
      subject: existing?.subject || '',
      teacher: existing?.teacher || existing?.teacher_name || '',
    });
    setModalOpen(true);
  }

  async function handleSaveSlot(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem('edupulse_token');
      const res = await fetch(`${API_URL}/api/timetable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          class: selectedClass,
          day: slotForm.day,
          period: slotForm.period,
          subject: slotForm.subject,
          teacher: slotForm.teacher,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed to save slot' }));
        throw new Error(err.error || 'Failed to save slot');
      }
      alert('Timetable slot saved!');
      setModalOpen(false);
      fetchTimetable();
    } catch (err) {
      alert(err.message || 'Failed to save timetable slot');
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Timetable</h2>
          <p className="text-text-secondary text-sm mt-1">Manage class schedules</p>
        </div>
      </div>

      {/* Class Selector */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-text-secondary">Class:</label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="input-field w-auto"
        >
          {CLASSES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Timetable Grid */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-gray-50/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider w-20">
                  Period
                </th>
                {DAYS.map((day) => (
                  <th key={day} className="text-center px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERIODS.map((period) => (
                <tr key={period} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-sm font-medium text-text-primary">
                    P{period}
                  </td>
                  {DAYS.map((day, dayIndex) => {
                    const slot = getSlot(dayIndex + 1, period);
                    return (
                      <td key={day} className="px-2 py-2 text-center">
                        <button
                          onClick={() => openSlotModal(dayIndex, period)}
                          className={`w-full min-h-[60px] rounded-lg border border-border p-2 text-xs transition-colors hover:border-primary/50 hover:bg-primary/5 ${
                            slot ? 'bg-primary/5' : 'bg-white'
                          }`}
                        >
                          {slot ? (
                            <>
                              <p className="font-medium text-text-primary">{slot.subject}</p>
                              <p className="text-text-muted mt-0.5">{slot.teacher || slot.teacher_name || ''}</p>
                            </>
                          ) : (
                            <span className="text-text-muted">
                              <PlusIcon className="w-4 h-4 mx-auto" />
                            </span>
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Slot Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Assign Timetable Slot">
        <form onSubmit={handleSaveSlot} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1 block">Day</label>
              <select
                value={slotForm.day}
                onChange={(e) => setSlotForm({ ...slotForm, day: Number(e.target.value) })}
                className="input-field"
              >
                {DAYS.map((d, i) => (
                  <option key={d} value={i + 1}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1 block">Period</label>
              <select
                value={slotForm.period}
                onChange={(e) => setSlotForm({ ...slotForm, period: Number(e.target.value) })}
                className="input-field"
              >
                {PERIODS.map((p) => (
                  <option key={p} value={p}>Period {p}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary mb-1 block">Subject *</label>
            <input
              type="text"
              value={slotForm.subject}
              onChange={(e) => setSlotForm({ ...slotForm, subject: e.target.value })}
              className="input-field"
              placeholder="e.g. Mathematics"
              list="subjects-list"
              required
            />
            <datalist id="subjects-list">
              {Array.isArray(subjects) && subjects.map((s) => (
                <option key={s.id || s.name} value={s.name} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary mb-1 block">Teacher *</label>
            <input
              type="text"
              value={slotForm.teacher}
              onChange={(e) => setSlotForm({ ...slotForm, teacher: e.target.value })}
              className="input-field"
              placeholder="e.g. Mr. Sharma"
              list="teachers-list"
              required
            />
            <datalist id="teachers-list">
              {Array.isArray(teachers) && teachers.map((t) => (
                <option key={t.id || t.name} value={t.name} />
              ))}
            </datalist>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Slot</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
