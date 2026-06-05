const express = require('express');
const router = express.Router();
const cronController = require('../controllers/cronController');

// Vercel cron trigger
router.get('/reminders', cronController.triggerReminders);

module.exports = router;
