# EduPulse Schools (School Admin Portal)

Next.js 14 school admin portal for the EduPulse school management platform.

## Features

- School dashboard with attendance, fee collection, student/staff counts
- Student admissions (new admission + existing student import)
- Staff management (teaching + non-teaching staff)
- Attendance tracking
- Timetable management
- Subjects & exam type configuration
- Academic calendar
- Fees management & structure
- Announcements
- Teacher permissions
- Bulk import (Excel)
- School settings

## Setup

```bash
npm install
cp .env.local.example .env.local   # set your API URL
npm run dev
```

Runs on port 3000 by default.

## Build

```bash
npm run build
npm start
```

Uses Next.js static export (`output: 'export'` in `next.config.js`).

## Environment Variables

```
NEXT_PUBLIC_API_URL=http://your-backend-url
```

## Security Note

The school directory picker (which publicly listed all schools via
`GET /api/schools/list`) has been **removed**. School admins now log in
directly with their Admin ID + Password — no school search needed, since
the backend resolves the user's school from their ID.

## Related Repos

- **edupulse-backend** — Node.js + Express REST API
- **edupulse-mobile** — Flutter mobile app
- **edupulse-admin** — Enterprise admin portal (Next.js)
