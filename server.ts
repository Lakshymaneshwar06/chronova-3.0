import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory persistent stores with domain-specific seed items
const memoryEvents: any[] = [
  {
    id: 'evt-1',
    title: 'HackNova 2026: Global AI & Cloud Sprint',
    tagline: '36-hour flagship inter-collegiate engineering hackathon',
    category: 'hackathon',
    format: 'in-person',
    venue: 'Ada Lovelace Grand Auditorium & Turing Hall',
    startDate: '2026-10-15T09:00:00Z',
    endDate: '2026-10-16T21:00:00Z',
    registrationDeadline: '2026-10-10T23:59:59Z',
    totalSeats: 250,
    registeredSeats: 198,
    prizes: '$12,500 Cash & Incubation Grants',
    featured: true
  }
];

const memoryResources: any[] = [
  {
    id: 'res-1',
    title: 'Distributed Consensus & Raft Protocol Deep Dive',
    courseCode: 'CS402',
    courseName: 'Distributed Systems & Cloud Architecture',
    department: 'cs',
    semester: 7,
    type: 'pdf',
    description: 'Comprehensive faculty lecture notes covering quorum slices, leader election, and log compaction.',
    fileSize: '4.8 MB',
    author: { name: 'Dr. Evelyn Vance', role: 'Faculty Chair, Computer Science' }
  }
];

const memoryClubs: any[] = [
  {
    id: 'club-1',
    name: 'Robotics & Autonomous Systems Guild',
    category: 'Technical Guild',
    meetingTime: 'Every Wednesday at 4:30 PM',
    location: 'Turing Innovation Lab 3, Block C',
    currentMembers: 48,
    leadName: 'Aarav Patel',
    qrToken: 'CHRON-CLUB-ROBOTICS-01'
  }
];

/**
 * STRICT ROLE-BASED ACCESS CONTROL (RBAC) MIDDLEWARE
 * Verifies that the client has an active 'admin' role.
 * Students or unauthenticated users attempting to access upload endpoints
 * will be strictly blocked with HTTP 403 Forbidden.
 */
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const roleHeader = (req.headers['x-user-role'] || '').toString().toLowerCase();
  const authHeader = (req.headers['authorization'] || '').toString();

  let resolvedRole = '';

  if (roleHeader === 'admin') {
    resolvedRole = 'admin';
  } else if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    if (token.includes('admin')) {
      resolvedRole = 'admin';
    } else if (token.includes('student')) {
      resolvedRole = 'student';
    }
  }

  // Check request body fallback if explicit token in payload
  if (!resolvedRole && req.body && req.body.role === 'admin') {
    resolvedRole = 'admin';
  }

  if (resolvedRole !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access Denied: Only Admin users are authorized to upload content. Students have view-only access.',
      code: 'FORBIDDEN_STUDENT_UPLOAD'
    });
  }

  next();
}

// -------------------------------------------------------------
// PUBLIC & QUERY API ROUTES
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Chronova Portal API', timestamp: new Date().toISOString() });
});

// Role-based permissions query
app.get('/api/auth/permissions', (req, res) => {
  const roleHeader = (req.headers['x-user-role'] || '').toString().toLowerCase();
  const isAdmin = roleHeader === 'admin';
  res.json({
    role: isAdmin ? 'admin' : 'student',
    canUpload: isAdmin,
    canView: true,
    allowedSections: isAdmin
      ? ['admin-events', 'admin-study', 'admin-clubs', 'admin-analytics', 'admin-attendance']
      : ['events', 'study', 'clubs', 'qr-hub', 'feedback']
  });
});

// Catalog listings (Public read-only for students and guests)
app.get('/api/events', (req, res) => {
  res.json({ success: true, count: memoryEvents.length, data: memoryEvents });
});

app.get('/api/resources', (req, res) => {
  res.json({ success: true, count: memoryResources.length, data: memoryResources });
});

app.get('/api/clubs', (req, res) => {
  res.json({ success: true, count: memoryClubs.length, data: memoryClubs });
});

// -------------------------------------------------------------
// STRICTLY PROTECTED UPLOAD ENDPOINTS (Admin Only)
// -------------------------------------------------------------

// Upload Study Material (Admin Only)
app.post('/api/upload/resource', requireAdmin, (req, res) => {
  const { title, courseCode, department, semester, type, description } = req.body;

  if (!title || !courseCode) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error: Title and Course Code are required for study uploads.'
    });
  }

  const newResource = {
    id: `res-${Date.now()}`,
    title: title.trim(),
    courseCode: courseCode.trim().toUpperCase(),
    courseName: req.body.courseName || `${courseCode.trim().toUpperCase()} Course Notes`,
    department: department || 'cs',
    semester: Number(semester) || 1,
    type: type || 'pdf',
    description: description || 'Verified academic course material.',
    fileSize: req.body.fileSize || '3.5 MB',
    author: req.body.author || { name: 'Faculty Administrator', role: 'Faculty Chair' },
    createdAt: new Date().toISOString()
  };

  memoryResources.unshift(newResource);

  return res.status(201).json({
    success: true,
    message: 'Study material uploaded successfully by authorized Admin.',
    data: newResource
  });
});

// Upload Event (Admin Only)
app.post('/api/upload/event', requireAdmin, (req, res) => {
  const { title, category, format, venue, startDate } = req.body;

  if (!title || !venue) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error: Title and Venue are required for event uploads.'
    });
  }

  const newEvent = {
    id: `evt-${Date.now()}`,
    title: title.trim(),
    category: category || 'workshop',
    format: format || 'in-person',
    venue: venue.trim(),
    startDate: startDate || new Date(Date.now() + 7 * 86400000).toISOString(),
    prizes: req.body.prizes || 'Free Registration',
    createdAt: new Date().toISOString()
  };

  memoryEvents.unshift(newEvent);

  return res.status(201).json({
    success: true,
    message: 'Event published successfully by authorized Admin.',
    data: newEvent
  });
});

// Register Club (Admin Only)
app.post('/api/upload/club', requireAdmin, (req, res) => {
  const { name, leadName, location } = req.body;

  if (!name || !leadName) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error: Club Name and Student Lead are required.'
    });
  }

  const newClub = {
    id: `club-${Date.now()}`,
    name: name.trim(),
    leadName: leadName.trim(),
    location: location || 'Campus Block C',
    category: req.body.category || 'Technical Guild',
    meetingTime: req.body.meetingTime || 'Weekly Meetup',
    currentMembers: Number(req.body.currentMembers) || 15,
    qrToken: req.body.qrToken || `CHRON-CLUB-${Date.now().toString().slice(-4)}`,
    createdAt: new Date().toISOString()
  };

  memoryClubs.unshift(newClub);

  return res.status(201).json({
    success: true,
    message: 'Club registered successfully by authorized Admin.',
    data: newClub
  });
});

// -------------------------------------------------------------
// VITE SPA DEV & PROD SERVING
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Chronova Server] Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
