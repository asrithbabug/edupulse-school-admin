const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://13.126.4.16';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('edupulse_token');
}

function getHeaders() {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const config = {
    headers: getHeaders(),
    ...options,
  };

  try {
    const res = await fetch(url, config);
    if (res.status === 401) {
      if (endpoint.includes('/api/auth/')) {
        const error = await res.json().catch(() => ({ error: 'Invalid credentials' }));
        const err = new Error(error.error || 'Invalid credentials');
        err.code = error.code || null;
        throw err;
      }
      if (typeof window !== 'undefined') {
        localStorage.removeItem('edupulse_token');
        localStorage.removeItem('edupulse_user');
        window.location.href = '/school/login';
      }
      throw new Error('Unauthorized');
    }
    if (res.status === 403) {
      const error = await res.json().catch(() => ({ error: 'Access denied' }));
      const errMsg = error.error || 'Access denied';
      const err = new Error(errMsg);
      err.code = error.code || null;
      throw err;
    }
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Request failed' }));
      const errMsg = error.error || error.message || 'Request failed';
      const err = new Error(errMsg);
      err.code = error.code || null;
      throw err;
    }
    return await res.json();
  } catch (err) {
    if (err.message === 'Unauthorized') throw err;
    if (endpoint.includes('/api/auth/') || options.method === 'POST' || options.method === 'PUT' || options.method === 'DELETE') {
      throw err;
    }
    console.warn(`API request failed: ${endpoint}`, err.message);
    return null;
  }
}

async function loginWithRole(data) {
  const role = data?.role;
  const preferredEndpoints = role === 'school_admin' || role === 'admin'
    ? ['/api/auth/school/login', '/api/auth/login']
    : ['/api/auth/login'];

  let lastError = new Error('Login failed');

  for (const endpoint of preferredEndpoints) {
    try {
      return await request(endpoint, { method: 'POST', body: JSON.stringify(data) });
    } catch (err) {
      lastError = err;
      if (endpoint === '/api/auth/login') break;
    }
  }

  throw lastError;
}

export const api = {
  // Auth
  login: (data) => loginWithRole(data),
  schoolLogin: (data) => loginWithRole({ ...data, role: 'school_admin' }),

  // Password Management
  verifyPasswordToken: (token) => request(`/api/password/verify-token/${token}`),
  setPassword: (data) => request('/api/password/set', { method: 'POST', body: JSON.stringify(data) }),
  requestPasswordReset: (data) => request('/api/password/reset-request', { method: 'POST', body: JSON.stringify(data) }),
  resendSetupLink: (userId) => request('/api/password/resend-setup', { method: 'POST', body: JSON.stringify({ userId }) }),

  // School Admin - Dashboard
  getAdminDashboard: () => request('/api/admin/dashboard'),

  // School Admin - Students
  getStudents: (params = '') => request(`/api/admin/students${params ? '?' + params : ''}`),
  createStudent: (data) => request('/api/admin/students', { method: 'POST', body: JSON.stringify(data) }),
  updateStudent: (id, data) => request(`/api/admin/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteStudent: (id) => request(`/api/admin/students/${id}`, { method: 'DELETE' }),

  // School Admin - Teachers
  getTeachers: () => request('/api/admin/teachers'),
  createTeacher: (data) => request('/api/admin/teachers', { method: 'POST', body: JSON.stringify(data) }),
  updateTeacher: (id, data) => request(`/api/admin/teachers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTeacher: (id) => request(`/api/admin/teachers/${id}`, { method: 'DELETE' }),

  // School Admin - Attendance
  getAttendance: (params = '') => request(`/api/admin/attendance${params ? '?' + params : ''}`),

  // Student Progress (for detail panel)
  getStudentAttendance: (id) => request(`/api/student/${id}/attendance`),
  getStudentMarks: (id) => request(`/api/student/${id}/marks`),
  getStudentFees: (id) => request(`/api/student/${id}/fees`),

  // School Admin - Fees
  getFees: () => request('/api/admin/fees'),
  getFeeStructure: () => request('/api/admin/fees/structure'),

  // School Admin - Announcements
  getAnnouncements: () => request('/api/announcements'),
  createAnnouncement: (data) => request('/api/announcements', { method: 'POST', body: JSON.stringify(data) }),

  // School Admin - Settings
  getSchoolProfile: () => request('/api/admin/settings'),
  updateSchoolProfile: (data) => request('/api/admin/settings', { method: 'PUT', body: JSON.stringify(data) }),

  // School Admin - Permissions
  getPermissionModules: () => request('/api/permissions/modules'),
  getTeacherPermissions: (teacherId) => request(`/api/permissions/${teacherId}`),
  updateTeacherPermissions: (teacherId, permissions) => request(`/api/permissions/${teacherId}`, { method: 'PUT', body: JSON.stringify({ permissions }) }),

  // School Admin - Subjects
  getSubjects: () => request('/api/subjects'),
  createSubject: (data) => request('/api/subjects', { method: 'POST', body: JSON.stringify(data) }),
  updateSubject: (id, data) => request(`/api/subjects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSubject: (id) => request(`/api/subjects/${id}`, { method: 'DELETE' }),

  // School Admin - Timetable
  getTimetable: (cls) => request(`/api/timetable/${cls}`),
  saveTimetableSlot: (data) => request('/api/timetable', { method: 'POST', body: JSON.stringify(data) }),

  // School Admin - Exams
  getExamTypes: () => request('/api/exams/types'),
  createExamType: (data) => request('/api/exams/types', { method: 'POST', body: JSON.stringify(data) }),

  // School Admin - Calendar
  getAcademicCalendar: (month, year) => request(`/api/academic/calendar?month=${month}&year=${year}`),
  createCalendarEvent: (data) => request('/api/academic/calendar', { method: 'POST', body: JSON.stringify(data) }),

  // School Admin - Fees Management
  assignFee: (data) => request('/api/fees-mgmt/assign', { method: 'POST', body: JSON.stringify(data) }),
  recordPayment: (id, data) => request(`/api/fees-mgmt/${id}/pay`, { method: 'PUT', body: JSON.stringify(data) }),
};

export default api;
