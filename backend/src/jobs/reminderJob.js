const cron = require('node-cron');
const appointmentRepository = require('../repositories/appointmentRepository');
const whatsappService = require('../services/whatsappService');
const logger = require('../utils/logger');

const startReminderJob = () => {
  const interval = process.env.CRON_REMINDER_INTERVAL || '* * * * *';
  const windowMinutes = parseInt(process.env.REMINDER_WINDOW_MINUTES) || 30;

  cron.schedule(interval, async () => {
    try {
      const now = new Date();
      const windowEnd = new Date(now.getTime() + windowMinutes * 60 * 1000);

      logger.debug(`[CRON] Checking for appointments between now and ${windowEnd.toUTCString()}`);

      const appointments = await appointmentRepository.findUpcomingUnreminded(windowEnd);

      if (appointments.length === 0) {
        logger.debug('[CRON] No pending reminders found');
        return;
      }

      logger.info(`[CRON] Found ${appointments.length} appointment(s) to remind`);

      for (const appt of appointments) {
        whatsappService.sendReminder(appt.phone, appt.customerName, appt.appointmentTime);
        await appointmentRepository.markReminderSent(appt._id);
        logger.info(`[CRON] Marked reminder sent for: ${appt.customerName}`);
      }
    } catch (error) {
      logger.error(`[CRON] Reminder job failed: ${error.message}`);
    }
  });

  logger.info(`[CRON] Reminder job started (interval: "${interval}", window: ${windowMinutes} mins)`);
};

module.exports = startReminderJob;
