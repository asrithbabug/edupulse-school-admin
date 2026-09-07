'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import { api } from '@/lib/api';
import { getUserRole, setAuth } from '@/lib/auth';

function SchoolLoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ id: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isInvalidCredentials, setIsInvalidCredentials] = useState(false);

  useEffect(() => {
    const role = getUserRole();
    if (role === 'school_admin') {
      router.replace('/admin/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsInvalidCredentials(false);
    setLoading(true);

    try {
      const res = await api.schoolLogin(formData);

      if (res && res.token) {
        setAuth(res.token, res.user || { name: 'School Admin', role: 'school_admin' });
        router.push('/admin/dashboard');
      } else {
        setError('Invalid credentials. Please check your Admin ID and password.');
        setIsInvalidCredentials(true);
      }
    } catch (err) {
      if (err.code === 'PASSWORD_NOT_SET' || (err.message && err.message.includes('set your password'))) {
        setError('Please set your password using the link sent to your email. Contact your school admin if you need a new link.');
      } else if (err.code === 'SCHOOL_LOCKED' || (err.message && err.message.includes('locked'))) {
        setError('Your school account has been locked. Please contact EduPulse support.');
        setIsInvalidCredentials(true);
      } else if (err.code === 'SCHOOL_INACTIVE' || (err.message && err.message.includes('inactive'))) {
        setError('Your school account is inactive. Please contact EduPulse support.');
        setIsInvalidCredentials(true);
      } else {
        setError(err.message || 'Login failed. Please check your credentials.');
        setIsInvalidCredentials(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen min-h-screen bg-background flex items-center justify-center px-4 overflow-hidden">
      <div className="w-full max-w-md mx-auto">
        <div className="card border border-border rounded-3xl shadow-xl p-8 space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <AcademicCapIcon className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">EduPulse School Admin</h1>
            <p className="text-text-secondary mt-2">Sign in to manage your school</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1.5 block">
                Admin ID
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => {
                  setFormData({ ...formData, id: e.target.value });
                  if (error) {
                    setError('');
                    setIsInvalidCredentials(false);
                  }
                }}
                placeholder="Enter admin ID"
                className={`input-field ${isInvalidCredentials ? 'border-danger ring-danger/10 focus:border-danger focus:ring-danger/20' : ''}`}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1.5 block">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (error) {
                    setError('');
                    setIsInvalidCredentials(false);
                  }
                }}
                placeholder="Enter password"
                className={`input-field ${isInvalidCredentials ? 'border-danger ring-danger/10 focus:border-danger focus:ring-danger/20' : ''}`}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-danger bg-danger/10 p-3 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !formData.id.trim() || !formData.password.trim()}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function SchoolLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <SchoolLoginForm />
    </Suspense>
  );
}
