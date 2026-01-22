require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');

// Import routes
const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news');
const recruitmentRoutes = require('./routes/recruitment');
const wikiRoutes = require('./routes/wiki');
const commandsRoutes = require('./routes/commands');
const settingsRoutes = require('./routes/settings');
const discordRoutes = require('./routes/discord');

// Import database
const db = require('./config/database');

// Import passport config
require('./config/passport');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/recruitment', recruitmentRoutes);
app.use('/api/wiki', wikiRoutes);
app.use('/api/commands', commandsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/discord', discordRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║           ELYON PVP - Backend Server                      ║
╠═══════════════════════════════════════════════════════════╣
║  🚀 Server running on http://localhost:${PORT}              ║
║  📦 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:8080'}              ║
║  🔌 Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}  ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
