import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { existsSync } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { connectDB, seedFromFileIfEmpty } from './server/db.js';
import User from './server/models/User.js';
import Project from './server/models/Project.js';
import Investment from './server/models/Investment.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataDir = join(__dirname, 'server', 'data');
const dataFile = join(dataDir, 'store.json');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

const defaultStore = {
  users: [
    {
      id: 'admin-1',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: bcrypt.hashSync('Admin@123', 8),
      userType: 'admin',
      role: 'admin',
    },
    {
      id: 'demo-founder',
      firstName: 'Demo',
      lastName: 'Founder',
      email: 'demo@example.com',
      password: bcrypt.hashSync('demo123', 8),
      userType: 'founder',
      role: 'founder',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'SolarGrid Mini',
      description: 'Portable solar charging system for remote teams and travel kits.',
      goal: 50000,
      raised: 32000,
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
      category: 'Clean Tech',
      daysLeft: 18,
      featured: true,
      founder: { name: 'Aarav Mehta', bio: 'Building compact clean-energy products for daily use.' },
      updates: [
        { date: '2026-04-02', content: 'Completed the second prototype validation test.' },
      ],
    },
    {
      id: 'proj-2',
      title: 'HealthNest AI',
      description: 'AI-assisted health dashboard that helps clinics triage routine patient queries.',
      goal: 80000,
      raised: 50000,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1e?auto=format&fit=crop&w=1200&q=80',
      category: 'Health Tech',
      daysLeft: 25,
      featured: true,
      founder: { name: 'Sara Khan', bio: 'Focused on practical AI for frontline healthcare.' },
      updates: [
        { date: '2026-04-01', content: 'Pilot trial started with two partner clinics.' },
      ],
    },
    {
      id: 'proj-3',
      title: 'CampusLoop',
      description: 'Student community platform for events, mentorship, and project collaboration.',
      goal: 25000,
      raised: 12000,
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
      category: 'EdTech',
      daysLeft: 31,
      featured: false,
      founder: { name: 'Riya Singh', bio: 'Helping students build stronger campus communities.' },
      updates: [],
    },
  ],
  investments: [
    {
      id: 'inv-1',
      projectId: 'proj-1',
      projectTitle: 'SolarGrid Mini',
      amount: 2500,
      createdAt: '2026-04-07T10:20:00.000Z',
      status: 'confirmed',
      investorName: 'Demo Investor',
    },
    {
      id: 'inv-2',
      projectId: 'proj-2',
      projectTitle: 'HealthNest AI',
      amount: 1500,
      createdAt: '2026-04-08T14:05:00.000Z',
      status: 'pending',
      investorName: 'Demo Investor',
    },
  ],
};

const app = express();
const port = process.env.PORT || 5000;
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.use(cors());
app.use(express.json());

function emitSyncUpdate(payload) {
  io.emit('sync:update', {
    timestamp: new Date().toISOString(),
    ...payload,
  });
}

async function ensureStore() {
  if (!existsSync(dataFile)) {
    await mkdir(dataDir, { recursive: true });
    await writeFile(dataFile, JSON.stringify(defaultStore, null, 2), 'utf-8');
  }
}

async function readStore() {
  // If MongoDB is connected, read from DB collections
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    const users = await User.find().lean();
    const projects = await Project.find().lean();
    const investments = await Investment.find().lean();
    return { users, projects, investments };
  }
  await ensureStore();
  const content = await readFile(dataFile, 'utf-8');
  return JSON.parse(content);
}

async function writeStore(store) {
  // If MongoDB is connected, write to collections (replace)
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    if (Array.isArray(store.users)) {
      await User.deleteMany({});
      await User.insertMany(store.users);
    }
    if (Array.isArray(store.projects)) {
      await Project.deleteMany({});
      await Project.insertMany(store.projects);
    }
    if (Array.isArray(store.investments)) {
      await Investment.deleteMany({});
      await Investment.insertMany(store.investments);
    }
    return;
  }
  await writeFile(dataFile, JSON.stringify(store, null, 2), 'utf-8');
}

function publicUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

function createToken(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '7d' });
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function getAuthUser(req, store) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const userId = payload && payload.sub ? payload.sub : null;
    return store.users.find((user) => user.id === userId) || null;
  } catch (err) {
    return null;
  }
}

function requireAuth(req, res, next) {
  readStore().then((store) => {
    const user = getAuthUser(req, store);
    if (!user) return res.status(401).json({ message: 'Unauthorized.' });
    req.user = user;
    next();
  }).catch((err) => res.status(500).json({ message: 'Server error.' }));
}

function requireRole(role) {
  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized.' });
    if (user.role !== role && user.userType !== role) {
      return res.status(403).json({ message: 'Forbidden.' });
    }
    next();
  };
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'kickscale-backend' });
});

app.post('/api/auth/signup', async (req, res) => {
  const { firstName, lastName, email, password, userType } = req.body || {};

  if (!firstName || !lastName || !email || !password || !userType) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  const store = await readStore();
  const existingUser = store.users.find((user) => user.email.toLowerCase() === String(email).toLowerCase());

  if (existingUser) {
    return res.status(409).json({ message: 'User already exists.' });
  }

  const hashed = bcrypt.hashSync(password, 8);
  const newUser = {
    id: randomUUID(),
    firstName,
    lastName,
    email,
    password: hashed,
    userType,
    role: userType,
  };

  store.users.unshift(newUser);
  await writeStore(store);

  return res.status(201).json({ token: createToken(newUser.id), user: publicUser(newUser) });
});

// Backward compatibility alias
app.post('/api/auth/register', async (req, res) => {
  const { firstName, lastName, email, password, userType } = req.body || {};

  if (!firstName || !lastName || !email || !password || !userType) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  const store = await readStore();
  const existingUser = store.users.find((user) => user.email.toLowerCase() === String(email).toLowerCase());

  if (existingUser) {
    return res.status(409).json({ message: 'User already exists.' });
  }

  const hashed = bcrypt.hashSync(password, 8);
  const newUser = {
    id: randomUUID(),
    firstName,
    lastName,
    email,
    password: hashed,
    userType,
    role: userType,
  };

  store.users.unshift(newUser);
  await writeStore(store);

  return res.status(201).json({ token: createToken(newUser.id), user: publicUser(newUser) });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  const store = await readStore();
  const user = store.users.find((item) => item.email.toLowerCase() === String(email).toLowerCase());
  if (!user) return res.status(401).json({ message: 'Invalid email or password.' });
  const match = bcrypt.compareSync(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid email or password.' });
  return res.json({ token: createToken(user.id), user: publicUser(user) });
});

app.get('/api/users/profile', requireAuth, async (req, res) => {
  return res.json(publicUser(req.user));
});

app.put('/api/users/profile', requireAuth, async (req, res) => {
  const store = await readStore();
  const user = req.user;
  const { firstName, lastName, userType } = req.body || {};
  user.firstName = firstName ?? user.firstName;
  user.lastName = lastName ?? user.lastName;
  user.userType = userType ?? user.userType;
  user.role = userType ?? user.role;
  await writeStore(store);
  return res.json(publicUser(user));
});

app.get('/api/projects', async (req, res) => {
  const store = await readStore();
  const { featured, category, limit } = req.query;

  let projects = [...store.projects];

  if (featured === 'true') {
    projects = projects.filter((project) => project.featured);
  }

  if (category) {
    projects = projects.filter((project) => String(project.category).toLowerCase() === String(category).toLowerCase());
  }

  if (limit) {
    projects = projects.slice(0, Number(limit));
  }

  return res.json(projects);
});

app.get('/api/projects/:id', async (req, res) => {
  const store = await readStore();
  const project = store.projects.find((item) => item.id === req.params.id);

  if (!project) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  return res.json(project);
});

app.post('/api/projects', requireAuth, async (req, res) => {
  const store = await readStore();
  const { title, description, goal, image, category, daysLeft, featured, founder, updates } = req.body || {};

  if (!title || !description || !goal || !image || !category) {
    return res.status(400).json({ message: 'Missing required project fields.' });
  }

  const newProject = {
    id: randomUUID(),
    title,
    description,
    goal: Number(goal),
    raised: 0,
    image,
    category,
    daysLeft: Number(daysLeft || 30),
    featured: Boolean(featured),
    founder: founder || { name: 'Founder Name', bio: 'Founder bio' },
    updates: Array.isArray(updates) ? updates : [],
  };

  store.projects.unshift(newProject);
  await writeStore(store);
  emitSyncUpdate({ resource: 'projects', action: 'created', id: newProject.id });
  return res.status(201).json(newProject);
});

app.put('/api/projects/:id', requireAuth, async (req, res) => {
  const store = await readStore();
  const project = store.projects.find((item) => item.id === req.params.id);

  if (!project) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  // Only allow admin to update any project
  if (req.user.role !== 'admin' && req.user.userType !== 'admin') {
    return res.status(403).json({ message: 'Only admins can update projects.' });
  }

  Object.assign(project, req.body || {});
  await writeStore(store);
  emitSyncUpdate({ resource: 'projects', action: 'updated', id: project.id });
  return res.json(project);
});

app.delete('/api/projects/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const store = await readStore();
  const nextProjects = store.projects.filter((item) => item.id !== req.params.id);

  if (nextProjects.length === store.projects.length) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  store.projects = nextProjects;
  await writeStore(store);
  emitSyncUpdate({ resource: 'projects', action: 'deleted', id: req.params.id });
  return res.status(204).send();
});

app.get('/api/projects/:id/investments', async (req, res) => {
  const store = await readStore();
  const projectInvestments = store.investments.filter((investment) => investment.projectId === req.params.id);
  return res.json(projectInvestments);
});

app.get('/api/investments', async (req, res) => {
  const store = await readStore();
  return res.json(store.investments);
});

app.get('/api/investments/:id', async (req, res) => {
  const store = await readStore();
  const investment = store.investments.find((item) => item.id === req.params.id);

  if (!investment) {
    return res.status(404).json({ message: 'Investment not found.' });
  }

  return res.json(investment);
});

app.post('/api/investments', async (req, res) => {
  const store = await readStore();
  const { projectId, projectTitle, amount, status } = req.body || {};
  const numericAmount = Number(amount);

  if (!projectId || !numericAmount || numericAmount <= 0) {
    return res.status(400).json({ message: 'Project and valid amount are required.' });
  }

  const project = store.projects.find((item) => item.id === projectId);
  const investment = {
    id: randomUUID(),
    projectId,
    projectTitle: projectTitle || project?.title || 'Project',
    amount: numericAmount,
    createdAt: new Date().toISOString(),
    status: status || 'confirmed',
    investorName: getAuthUser(req, store)
      ? `${getAuthUser(req, store).firstName} ${getAuthUser(req, store).lastName}`
      : 'Guest Investor',
  };

  store.investments.unshift(investment);

  if (project && investment.status === 'confirmed') {
    project.raised = Number(project.raised || 0) + numericAmount;
  }

  await writeStore(store);
  emitSyncUpdate({ resource: 'investments', action: 'created', id: investment.id, projectId });
  if (project) {
    emitSyncUpdate({ resource: 'projects', action: 'updated', id: project.id, projectId: project.id });
  }
  return res.status(201).json(investment);
});

app.post('/api/payments/initiate', async (req, res) => {
  const { amount, projectId } = req.body || {};
  
  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  if (!projectId) {
    return res.status(400).json({ message: 'Project ID is required' });
  }

  const store = await readStore();
  const project = store.projects.find((p) => p.id === projectId);
  
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  const paymentId = `pay_${randomUUID().toString().substring(0, 12)}`;
  
  return res.status(201).json({
    success: true,
    paymentId,
    projectId,
    amount: Number(amount),
    status: 'initiated',
    createdAt: new Date().toISOString(),
  });
});

app.post('/api/payments/verify', async (req, res) => {
  const { paymentId } = req.body || {};
  
  if (!paymentId) {
    return res.status(400).json({ message: 'Payment ID is required' });
  }

  // Simulate random success rate (95% success for demo)
  const isSuccessful = Math.random() < 0.95;

  if (!isSuccessful) {
    return res.status(400).json({ 
      message: 'Payment verification failed. Please try again.',
      verified: false,
    });
  }

  emitSyncUpdate({ resource: 'payments', action: 'verified', id: paymentId });
  return res.json({
    success: true,
    paymentId,
    status: 'verified',
    verified: true,
    verifiedAt: new Date().toISOString(),
  });
});

// Admin endpoints
app.get('/api/admin/projects', requireAuth, requireRole('admin'), async (req, res) => {
  const store = await readStore();
  return res.json(store.projects);
});

app.post('/api/admin/projects/:id/approve', requireAuth, requireRole('admin'), async (req, res) => {
  const store = await readStore();
  const project = store.projects.find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found.' });
  project.approved = true;
  await writeStore(store);
  emitSyncUpdate({ resource: 'projects', action: 'updated', id: project.id });
  return res.json(project);
});

app.post('/api/admin/projects/:id/reject', requireAuth, requireRole('admin'), async (req, res) => {
  const store = await readStore();
  const project = store.projects.find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found.' });
  project.rejected = true;
  await writeStore(store);
  emitSyncUpdate({ resource: 'projects', action: 'updated', id: project.id });
  return res.json(project);
});

httpServer.listen(port, async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    await seedFromFileIfEmpty({ User, Project, Investment });
    const url = process.env.RAILWAY_ENVIRONMENT_NAME ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : `http://localhost:${port}`;
    console.log(`Kickscale backend running at ${url} (MongoDB enabled)`);
  } catch (err) {
    await ensureStore();
    const url = process.env.RAILWAY_ENVIRONMENT_NAME ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : `http://localhost:${port}`;
    console.log(`Kickscale backend running at ${url} (fallback JSON store)`);
  }
});