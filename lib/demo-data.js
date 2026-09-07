// Demo/fallback data for static export and when API is unavailable

export const demoStudents = [
  { id: 1, name: 'Aarav Sharma', class: '10-A', rollNo: '001', parentName: 'Rajesh Sharma', phone: '9876543210', email: 'rajesh@email.com', status: 'active' },
  { id: 2, name: 'Priya Patel', class: '10-A', rollNo: '002', parentName: 'Vikram Patel', phone: '9876543211', email: 'vikram@email.com', status: 'active' },
  { id: 3, name: 'Rohan Gupta', class: '10-B', rollNo: '003', parentName: 'Amit Gupta', phone: '9876543212', email: 'amit@email.com', status: 'active' },
  { id: 4, name: 'Sneha Reddy', class: '9-A', rollNo: '004', parentName: 'Suresh Reddy', phone: '9876543213', email: 'suresh@email.com', status: 'active' },
  { id: 5, name: 'Karan Singh', class: '9-A', rollNo: '005', parentName: 'Manpreet Singh', phone: '9876543214', email: 'manpreet@email.com', status: 'inactive' },
  { id: 6, name: 'Ananya Iyer', class: '9-B', rollNo: '006', parentName: 'Ramesh Iyer', phone: '9876543215', email: 'ramesh@email.com', status: 'active' },
  { id: 7, name: 'Arjun Nair', class: '8-A', rollNo: '007', parentName: 'Gopal Nair', phone: '9876543216', email: 'gopal@email.com', status: 'active' },
  { id: 8, name: 'Meera Joshi', class: '8-A', rollNo: '008', parentName: 'Sunil Joshi', phone: '9876543217', email: 'sunil@email.com', status: 'active' },
  { id: 9, name: 'Vivek Kumar', class: '8-B', rollNo: '009', parentName: 'Rakesh Kumar', phone: '9876543218', email: 'rakesh@email.com', status: 'active' },
  { id: 10, name: 'Divya Menon', class: '7-A', rollNo: '010', parentName: 'Unni Menon', phone: '9876543219', email: 'unni@email.com', status: 'active' },
];

export const demoTeachers = [
  { id: 1, name: 'Dr. Suresh Kumar', subject: 'Mathematics', classes: '10-A, 10-B', phone: '9988776655', email: 'suresh.k@school.com', status: 'active' },
  { id: 2, name: 'Mrs. Lakshmi Nair', subject: 'English', classes: '9-A, 9-B', phone: '9988776656', email: 'lakshmi.n@school.com', status: 'active' },
  { id: 3, name: 'Mr. Rajiv Menon', subject: 'Science', classes: '10-A, 9-A', phone: '9988776657', email: 'rajiv.m@school.com', status: 'active' },
  { id: 4, name: 'Mrs. Priya Sharma', subject: 'Hindi', classes: '8-A, 8-B', phone: '9988776658', email: 'priya.s@school.com', status: 'active' },
  { id: 5, name: 'Mr. Anil Verma', subject: 'Social Studies', classes: '7-A, 8-A', phone: '9988776659', email: 'anil.v@school.com', status: 'on-leave' },
  { id: 6, name: 'Ms. Deepa Raj', subject: 'Computer Science', classes: '10-A, 10-B, 9-A', phone: '9988776660', email: 'deepa.r@school.com', status: 'active' },
];

export const demoAttendance = [
  { id: 1, studentName: 'Aarav Sharma', class: '10-A', date: '2024-01-15', status: 'present' },
  { id: 2, studentName: 'Priya Patel', class: '10-A', date: '2024-01-15', status: 'present' },
  { id: 3, studentName: 'Rohan Gupta', class: '10-B', date: '2024-01-15', status: 'absent' },
  { id: 4, studentName: 'Sneha Reddy', class: '9-A', date: '2024-01-15', status: 'present' },
  { id: 5, studentName: 'Karan Singh', class: '9-A', date: '2024-01-15', status: 'late' },
  { id: 6, studentName: 'Ananya Iyer', class: '9-B', date: '2024-01-15', status: 'present' },
  { id: 7, studentName: 'Arjun Nair', class: '8-A', date: '2024-01-15', status: 'present' },
  { id: 8, studentName: 'Meera Joshi', class: '8-A', date: '2024-01-15', status: 'absent' },
];

export const demoFees = [
  { id: 1, studentName: 'Aarav Sharma', class: '10-A', totalFee: 45000, paid: 45000, due: 0, status: 'paid', lastPayment: '2024-01-05' },
  { id: 2, studentName: 'Priya Patel', class: '10-A', totalFee: 45000, paid: 30000, due: 15000, status: 'partial', lastPayment: '2024-01-10' },
  { id: 3, studentName: 'Rohan Gupta', class: '10-B', totalFee: 45000, paid: 45000, due: 0, status: 'paid', lastPayment: '2023-12-20' },
  { id: 4, studentName: 'Sneha Reddy', class: '9-A', totalFee: 42000, paid: 0, due: 42000, status: 'overdue', lastPayment: '-' },
  { id: 5, studentName: 'Karan Singh', class: '9-A', totalFee: 42000, paid: 42000, due: 0, status: 'paid', lastPayment: '2024-01-02' },
  { id: 6, studentName: 'Ananya Iyer', class: '9-B', totalFee: 42000, paid: 21000, due: 21000, status: 'partial', lastPayment: '2024-01-08' },
];

export const demoAnnouncements = [
  { id: 1, title: 'Annual Day Celebration', content: 'Annual day will be celebrated on 26th January. All students must participate in cultural activities.', date: '2024-01-10', priority: 'high' },
  { id: 2, title: 'Parent-Teacher Meeting', content: 'PTM scheduled for 20th January for classes 9 and 10.', date: '2024-01-08', priority: 'medium' },
  { id: 3, title: 'Winter Vacation Notice', content: 'School will remain closed from 25th Dec to 5th Jan for winter break.', date: '2023-12-20', priority: 'low' },
  { id: 4, title: 'Fee Payment Reminder', content: 'Last date for fee payment for Q3 is 15th January.', date: '2024-01-05', priority: 'high' },
  { id: 5, title: 'Sports Day Registration', content: 'Register for sports day events by 18th January.', date: '2024-01-12', priority: 'medium' },
];

export const demoAdminDashboard = {
  totalStudents: 856,
  totalTeachers: 42,
  attendanceRate: 94.2,
  feesCollected: 3245000,
  feesTotal: 3850000,
  attendanceChart: [
    { day: 'Mon', rate: 96 },
    { day: 'Tue', rate: 94 },
    { day: 'Wed', rate: 92 },
    { day: 'Thu', rate: 95 },
    { day: 'Fri', rate: 91 },
  ],
  recentActivity: [
    { id: 1, text: 'New student Aarav Sharma enrolled in 10-A', time: '2 hours ago' },
    { id: 2, text: 'Fee payment received from Priya Patel - ₹15,000', time: '3 hours ago' },
    { id: 3, text: 'Teacher Dr. Suresh marked attendance for 10-A', time: '4 hours ago' },
    { id: 4, text: 'Announcement posted: Annual Day Celebration', time: '5 hours ago' },
    { id: 5, text: 'Leave request from Mr. Anil Verma approved', time: '6 hours ago' },
  ],
};

export const demoSchoolProfile = {
  name: 'Delhi Public School',
  address: '123 Education Lane, New Delhi',
  phone: '011-23456789',
  email: 'admin@dps.edu',
  principal: 'Dr. Ramesh Agarwal',
  established: '1995',
  board: 'CBSE',
  website: 'https://www.dps.edu',
};

// Enterprise Demo Data
export const demoEnterpriseSchools = [
  { id: 1, name: 'Delhi Public School', city: 'New Delhi', students: 856, teachers: 42, plan: 'Premium', status: 'active', joinedDate: '2023-06-15' },
  { id: 2, name: 'St. Mary\'s Academy', city: 'Mumbai', students: 1200, teachers: 58, plan: 'Enterprise', status: 'active', joinedDate: '2023-04-20' },
  { id: 3, name: 'Greenwood High', city: 'Bangalore', students: 650, teachers: 35, plan: 'Basic', status: 'trial', joinedDate: '2024-01-01' },
  { id: 4, name: 'Modern School', city: 'Pune', students: 480, teachers: 28, plan: 'Premium', status: 'active', joinedDate: '2023-08-10' },
  { id: 5, name: 'Rainbow International', city: 'Hyderabad', students: 920, teachers: 45, plan: 'Enterprise', status: 'locked', joinedDate: '2023-03-05' },
  { id: 6, name: 'Sunshine Academy', city: 'Chennai', students: 550, teachers: 30, plan: 'Basic', status: 'active', joinedDate: '2023-09-22' },
];

export const demoEnterpriseDashboard = {
  totalSchools: 24,
  totalRevenue: 18500000,
  activeSubscriptions: 22,
  openTickets: 7,
  schoolGrowth: [
    { month: 'Aug', schools: 18 },
    { month: 'Sep', schools: 19 },
    { month: 'Oct', schools: 20 },
    { month: 'Nov', schools: 22 },
    { month: 'Dec', schools: 23 },
    { month: 'Jan', schools: 24 },
  ],
  revenueChart: [
    { month: 'Aug', revenue: 14200000 },
    { month: 'Sep', revenue: 15100000 },
    { month: 'Oct', revenue: 15800000 },
    { month: 'Nov', revenue: 16900000 },
    { month: 'Dec', revenue: 17600000 },
    { month: 'Jan', revenue: 18500000 },
  ],
};

export const demoSubscriptionPlans = [
  { id: 1, name: 'Basic', price: 25000, interval: 'month', features: ['Up to 500 students', 'Basic analytics', 'Email support', '5 admin accounts'] },
  { id: 2, name: 'Premium', price: 50000, interval: 'month', features: ['Up to 1500 students', 'Advanced analytics', 'Priority support', '15 admin accounts', 'Custom branding'] },
  { id: 3, name: 'Enterprise', price: 100000, interval: 'month', features: ['Unlimited students', 'Full analytics suite', '24/7 support', 'Unlimited admins', 'Custom branding', 'API access', 'Dedicated account manager'] },
];

export const demoTickets = [
  { id: 1, school: 'Delhi Public School', subject: 'Unable to generate report', priority: 'high', status: 'open', createdAt: '2024-01-14' },
  { id: 2, school: 'St. Mary\'s Academy', subject: 'Login issues for teachers', priority: 'critical', status: 'in-progress', createdAt: '2024-01-13' },
  { id: 3, school: 'Greenwood High', subject: 'Feature request: Bulk upload', priority: 'low', status: 'open', createdAt: '2024-01-12' },
  { id: 4, school: 'Modern School', subject: 'Payment gateway error', priority: 'high', status: 'resolved', createdAt: '2024-01-10' },
  { id: 5, school: 'Rainbow International', subject: 'Account locked unexpectedly', priority: 'critical', status: 'open', createdAt: '2024-01-14' },
  { id: 6, school: 'Sunshine Academy', subject: 'Data export not working', priority: 'medium', status: 'in-progress', createdAt: '2024-01-11' },
  { id: 7, school: 'Delhi Public School', subject: 'Need additional admin accounts', priority: 'low', status: 'resolved', createdAt: '2024-01-09' },
];

export const demoAnalytics = {
  userActivity: [
    { month: 'Aug', admins: 45, teachers: 320, parents: 1800 },
    { month: 'Sep', admins: 48, teachers: 340, parents: 2100 },
    { month: 'Oct', admins: 50, teachers: 355, parents: 2400 },
    { month: 'Nov', admins: 52, teachers: 370, parents: 2650 },
    { month: 'Dec', admins: 54, teachers: 380, parents: 2800 },
    { month: 'Jan', admins: 56, teachers: 395, parents: 3050 },
  ],
  schoolGrowth: [
    { month: 'Aug', schools: 18 },
    { month: 'Sep', schools: 19 },
    { month: 'Oct', schools: 20 },
    { month: 'Nov', schools: 22 },
    { month: 'Dec', schools: 23 },
    { month: 'Jan', schools: 24 },
  ],
};
