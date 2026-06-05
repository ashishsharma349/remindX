const express = require('express');
const router = express.Router();
const cronController = require('../controllers/cronController');

// Vercel cron trigger
router.post('/reminders', cronController.triggerReminders);

module.exports = router;
