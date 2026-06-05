const { executeReminders } = require('../jobs/reminderJob');
const logger = require('../utils/logger');

// Trigger reminder execution
exports.triggerReminders = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      logger.warn('[CRON] Unauthorized attempt to trigger reminders');
      return res.status(401).json({ ok: false, message: 'Unauthorized' });
    }
    
    await executeReminders();
    res.status(200).json({ ok: true, message: 'Cron job executed successfully' });
  } catch (error) {
    next(error);
  }
};
