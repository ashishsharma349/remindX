const express = require('express');
const cors = require('cors');
const appointmentRoutes = require('./src/routes/appointmentRoutes');
const cronRoutes = require('./src/routes/cronRoutes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

// CORS — whitelist frontend origin
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',');
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true, message: 'Server is running' });
});

// Routes
app.use('/api/appointments', appointmentRoutes);
app.use('/api/cron', cronRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ ok: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;