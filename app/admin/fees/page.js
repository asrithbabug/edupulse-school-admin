'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';
import Badge from '@/components/Badge';
import LoadingSpinner from '@/components/LoadingSpinner';
import { api } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://13.126.4.16';

export default function FeesPage() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [assignForm, setAssignForm] = useState({ student_id: '', class: '', fee_type: '', amount: '', due_date: '' });
  const [payForm, setPayForm] = useState({ amount: '', paid_date: '', payment_mode: 'cash' });

  useEffect(() => {
    fetchFees();
  }, []);

  async function fetchFees() {
    try {
      const res = await api.getFees();
      setFees(res && res.data ? res.data : Array.isArray(res) ? res : []);
    } catch (err) {
      console.warn('Failed to fetch fees:', err.message);
      setFees([]);
    }
    setLoading(false);
  }

  async function handleAssignFee(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem('edupulse_token');
      const res = await fetch(`${API_URL}/api/fees-mgmt/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          student_id: assignForm.student_id || undefined,
          class: assignForm.class || undefined,
          fee_type: assignForm.fee_type,
          amount: Number(assignForm.amount),
          due_date: assignForm.due_date,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed to assign fee' }));
        throw new Error(err.error || 'Failed to assign fee');
      }
      alert('Fee assigned successfully!');
      setAssignModalOpen(false);
      setAssignForm({ student_id: '', class: '', fee_type: '', amount: '', due_date: '' });
      fetchFees();
    } catch (err) {
      alert(err.message || 'Failed to assign fee');
    }
  }

  async function handleRecordPayment(e) {
    e.preventDefault();
    if (!selectedFee) return;
    try {
      const token = localStorage.getItem('edupulse_token');
      const res = await fetch(`${API_URL}/api/fees-mgmt/${selectedFee.id}/pay`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number(payForm.amount),
          paid_date: payForm.paid_date,
          payment_mode: payForm.payment_mode,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed to record payment' }));
        throw new Error(err.error || 'Failed to record payment');
      }
      alert('Payment recorded successfully!');
      setPayModalOpen(false);
      setSelectedFee(null);
      setPayForm({ amount: '', paid_date: '', payment_mode: 'cash' });
      fetchFees();
    } catch (err) {
      alert(err.message || 'Failed to record payment');
    }
  }

  function openPayModal(fee) {
    setSelectedFee(fee);
    setPayForm({ amount: fee.due || '', paid_date: new Date().toISOString().split('T')[0], payment_mode: 'cash' });
    setPayModalOpen(true);
  }

  const filteredFees = filter === 'all' ? fees : fees.filter((f) => f.status === filter);

  const statusVariant = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'partial': return 'warning';
      case 'overdue': return 'danger';
      default: return 'neutral';
    }
  };

  const columns = [
    { key: 'student_name', label: 'Student' },
    { key: 'class', label: 'Class' },
    { key: 'total_fee', label: 'Total Fee', render: (val) => `₹${(val || 0).toLocaleString()}` },
    { key: 'paid', label: 'Paid', render: (val) => `₹${(val || 0).toLocaleString()}` },
    { key: 'due', label: 'Due', render: (val) => val > 0 ? <span className="text-danger font-medium">₹{(val || 0).toLocaleString()}</span> : '₹0' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <Badge variant={statusVariant(val)}>
          {val ? val.charAt(0).toUpperCase() + val.slice(1) : 'N/A'}
        </Badge>
      ),
    },
    { key: 'last_payment', label: 'Last Payment', render: (val) => val ? new Date(val).toLocaleDateString() : '—' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <button
          onClick={() => openPayModal(row)}
          className="px-2 py-1 text-xs font-medium bg-success/10 text-success rounded-lg hover:bg-success/20 transition-colors"
          title="Record Payment"
        >
          💰 Pay
        </button>
      ),
    },
  ];

  // Summary stats
  const totalCollected = fees.reduce((sum, f) => sum + (f.paid || 0), 0);
  const totalDue = fees.reduce((sum, f) => sum + (f.due || 0), 0);
  const totalFees = fees.reduce((sum, f) => sum + (f.total_fee || 0), 0);
  const overdueCount = fees.filter((f) => f.status === 'overdue').length;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Fee Management</h2>
          <p className="text-text-secondary text-sm mt-1">Track fee collection and pending dues</p>
        </div>
        <button
          onClick={() => setAssignModalOpen(true)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <PlusIcon className="w-4 h-4" /> Add
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-text-secondary">Total Fees</p>
          <p className="text-xl font-bold text-text-primary mt-1">₹{totalFees.toLocaleString()}</p>
        </div>
        <div className="card">
          <p className="text-sm text-text-secondary">Collected</p>
          <p className="text-xl font-bold text-success mt-1">₹{totalCollected.toLocaleString()}</p>
        </div>
        <div className="card">
          <p className="text-sm text-text-secondary">Pending</p>
          <p className="text-xl font-bold text-warning mt-1">₹{totalDue.toLocaleString()}</p>
        </div>
        <div className="card">
          <p className="text-sm text-text-secondary">Overdue Students</p>
          <p className="text-xl font-bold text-danger mt-1">{overdueCount}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'paid', 'partial', 'overdue'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-primary text-white'
                : 'bg-white border border-border text-text-secondary hover:bg-gray-50'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filteredFees}
        searchPlaceholder="Search by student name..."
      />

      {/* Assign Fee Modal */}
      <Modal isOpen={assignModalOpen} onClose={() => setAssignModalOpen(false)} title="Fee Details">
        <form onSubmit={handleAssignFee} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-text-secondary mb-1 block">Student ID (leave blank for entire class)</label>
            <input
              type="text"
              value={assignForm.student_id}
              onChange={(e) => setAssignForm({ ...assignForm, student_id: e.target.value })}
              className="input-field"
              placeholder="e.g. STU001"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary mb-1 block">Class (for bulk assign)</label>
            <input
              type="text"
              value={assignForm.class}
              onChange={(e) => setAssignForm({ ...assignForm, class: e.target.value })}
              className="input-field"
              placeholder="e.g. 10-A"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1 block">Fee Type *</label>
              <input
                type="text"
                value={assignForm.fee_type}
                onChange={(e) => setAssignForm({ ...assignForm, fee_type: e.target.value })}
                className="input-field"
                placeholder="e.g. Tuition, Lab, Transport"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1 block">Amount *</label>
              <input
                type="number"
                value={assignForm.amount}
                onChange={(e) => setAssignForm({ ...assignForm, amount: e.target.value })}
                className="input-field"
                placeholder="₹"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary mb-1 block">Due Date *</label>
            <input
              type="date"
              value={assignForm.due_date}
              onChange={(e) => setAssignForm({ ...assignForm, due_date: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setAssignModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Add</button>
          </div>
        </form>
      </Modal>

      {/* Record Payment Modal */}
      <Modal isOpen={payModalOpen} onClose={() => setPayModalOpen(false)} title="Record Payment">
        <form onSubmit={handleRecordPayment} className="space-y-4">
          {selectedFee && (
            <div className="bg-gray-50 rounded-lg p-3 mb-2">
              <p className="text-sm text-text-primary font-medium">{selectedFee.student_name}</p>
              <p className="text-xs text-text-secondary">Due: ₹{(selectedFee.due || 0).toLocaleString()}</p>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-text-secondary mb-1 block">Amount Paid *</label>
            <input
              type="number"
              value={payForm.amount}
              onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })}
              className="input-field"
              placeholder="₹"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary mb-1 block">Payment Date *</label>
            <input
              type="date"
              value={payForm.paid_date}
              onChange={(e) => setPayForm({ ...payForm, paid_date: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary mb-1 block">Payment Mode</label>
            <select
              value={payForm.payment_mode}
              onChange={(e) => setPayForm({ ...payForm, payment_mode: e.target.value })}
              className="input-field"
            >
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cheque">Cheque</option>
              <option value="online">Online</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setPayModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Record Payment</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
