'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';
import LoadingSpinner from '@/components/LoadingSpinner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://13.126.4.16';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', department: '' });

  useEffect(() => {
    fetchSubjects();
  }, []);

  async function fetchSubjects() {
    try {
      const token = localStorage.getItem('edupulse_token');
      const res = await fetch(`${API_URL}/api/subjects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch subjects');
      const data = await res.json();
      setSubjects(data.data || data || []);
    } catch (err) {
      console.warn('Failed to fetch subjects:', err.message);
      setSubjects([]);
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem('edupulse_token');
      const url = editingSubject
        ? `${API_URL}/api/subjects/${editingSubject.id}`
        : `${API_URL}/api/subjects`;
      const method = editingSubject ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed to save subject' }));
        throw new Error(err.error || 'Failed to save subject');
      }
      alert(editingSubject ? 'Subject updated!' : 'Subject created!');
      setModalOpen(false);
      setEditingSubject(null);
      setFormData({ name: '', code: '', department: '' });
      fetchSubjects();
    } catch (err) {
      alert(err.message || 'Failed to save subject');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this subject?')) return;
    try {
      const token = localStorage.getItem('edupulse_token');
      const res = await fetch(`${API_URL}/api/subjects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed to delete subject' }));
        throw new Error(err.error || 'Failed to delete subject');
      }
      setSubjects(subjects.filter((s) => s.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete subject');
    }
  }

  function openEditModal(subject) {
    setEditingSubject(subject);
    setFormData({ name: subject.name, code: subject.code || '', department: subject.department || '' });
    setModalOpen(true);
  }

  const columns = [
    { key: 'name', label: 'Subject Name' },
    { key: 'code', label: 'Code' },
    { key: 'department', label: 'Department' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button onClick={() => openEditModal(row)} className="p-1 hover:bg-gray-100 rounded" title="Edit">
            <PencilIcon className="w-4 h-4 text-text-secondary" />
          </button>
          <button onClick={() => handleDelete(row.id)} className="p-1 hover:bg-gray-100 rounded" title="Delete">
            <TrashIcon className="w-4 h-4 text-danger" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Subjects</h2>
          <p className="text-text-secondary text-sm mt-1">Manage school subjects</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={Array.isArray(subjects) ? subjects : []}
        searchPlaceholder="Search subjects..."
        actions={
          <button
            onClick={() => { setEditingSubject(null); setFormData({ name: '', code: '', department: '' }); setModalOpen(true); }}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <PlusIcon className="w-4 h-4" /> Add
          </button>
        }
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingSubject ? 'Edit Subject' : 'Subject Details'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-text-secondary mb-1 block">Subject Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="e.g. Mathematics"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1 block">Code *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="input-field"
                placeholder="e.g. MATH"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1 block">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="input-field"
                placeholder="e.g. Science"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editingSubject ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
