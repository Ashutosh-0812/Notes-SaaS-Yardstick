const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import models
require('./models/User');
require('./models/Tenant');
require('./models/Note');

const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const tenantsRoutes = require('./routes/tenants');
const healthRoutes = require('./routes/health');

const app = express();

// Middleware - CORS with proper configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/tenants', tenantsRoutes);
app.use('/api/health', healthRoutes);

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve static frontend
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// ⚡ Important: Only fallback to index.html for routes that are NOT API and NOT asset files
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next(); // let API routes work
  }
  res.sendFile(path.join(publicPath, 'index.html'));
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/notes-saas';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler (only if not caught above)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

module.exports = app;
