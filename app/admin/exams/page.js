'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon } from '@heroicons/react/24/outline';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';
import Badge from '@/components/Badge';
import LoadingSpinner from '@/components/LoadingSpinner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://13.126.4.16';

export default function ExamsPage() {
  const [examTypes, setExamTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', max_marks: '', description: '' });

  useEffect(() => {
    fetchExamTypes();
  }, []);

  async function fetchExamTypes() {
    try {
      const token = localStorage.getItem('edupulse_token');
      const res = await fetch(`${API_URL}/api/exams/types`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch exam types');
      const data = await res.json();
      setExamTypes(data.data || data || []);
    } catch (err) {
      console.warn('Failed to fetch exam types:', err.message);
      setExamTypes([]);
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem('edupulse_token');
      const res = await fetch(`${API_URL}/api/exams/types`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          max_marks: Number(formData.max_marks),
          description: formData.description || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed to create exam type' }));
        throw new Error(err.error || 'Failed to create exam type');
      }
      alert('Exam type created successfully!');
      setModalOpen(false);
      setFormData({ name: '', max_marks: '', description: '' });
      fetchExamTypes();
    } catch (err) {
      alert(err.message || 'Failed to create exam type');
    }
  }

  const columns = [
    { key: 'name', label: 'Exam Name' },
    { key: 'max_marks', label: 'Max Marks', render: (val) => val || '—' },
    { key: 'description', label: 'Description', render: (val) => val || '—' },
    {
      key: 'date',
      label: 'Scheduled Date',
      render: (val) => val ? new Date(val).toLocaleDateString() : <span className="text-text-muted">Not scheduled</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (val, row) => {
        const isScheduled = row.date || val === 'scheduled';
        return (
          <Badge variant={isScheduled ? 'success' : 'neutral'}>
            {isScheduled ? 'Scheduled' : 'Draft'}
          </Badge>
        );
      },
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Exams</h2>
          <p className="text-text-secondary text-sm mt-1">Manage exam types and schedules</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-sm text-text-secondary">Total Exam Types</p>
          <p className="text-xl font-bold text-text-primary mt-1">{examTypes.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-text-secondary">Scheduled</p>
          <p className="text-xl font-bold text-success mt-1">
            {examTypes.filter((e) => e.date || e.status === 'scheduled').length}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-text-secondary">Upcoming</p>
          <p className="text-xl font-bold text-primary mt-1">
            {examTypes.filter((e) => e.date && new Date(e.date) > new Date()).length}
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={Array.isArray(examTypes) ? examTypes : []}
        searchPlaceholder="Search exam types..."
        actions={
          <button
            onClick={() => { setFormData({ name: '', max_marks: '', description: '' }); setModalOpen(true); }}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <PlusIcon className="w-4 h-4" /> Add
          </button>
        }
      />

      {/* Add Exam Type Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Exam Type">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-text-secondary mb-1 block">Exam Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="e.g. Unit Test 1, Mid Term, Final"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary mb-1 block">Max Marks *</label>
            <input
              type="number"
              value={formData.max_marks}
              onChange={(e) => setFormData({ ...formData, max_marks: e.target.value })}
              className="input-field"
              placeholder="e.g. 100"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary mb-1 block">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows={3}
              placeholder="Optional description..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Create</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
