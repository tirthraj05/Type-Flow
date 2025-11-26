require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting middleware
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per windowMs for auth endpoints
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(generalLimiter); // Apply general rate limiting to all routes

// Routes
const authRoutes = require('./routes/auth');
const testRoutes = require('./routes/tests');

app.use('/api/auth', authLimiter, authRoutes); // Rate limit auth endpoints strictly
app.use('/api/tests', testRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST /api/auth/signup');
  console.log('  POST /api/auth/login');
  console.log('  POST /api/auth/logout');
  console.log('  POST /api/tests');
  console.log('  GET /api/tests');
  console.log('  GET /api/tests/:id');
  console.log('  GET /api/tests/stats');
  console.log('  GET /api/tests/export/csv');
});
