const appointmentRepository = require('../repositories/appointmentRepository');
const whatsappService = require('../services/whatsappService');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');

// Execute the reminder logic once
exports.executeReminders = async () => {
  const windowMinutes = parseInt(process.env.REMINDER_WINDOW_MINUTES) || 30;
  
  try {
    const now = new Date();
    const windowStart = new Date(now.getTime() + 50 * 60 * 1000);
    const windowEnd = new Date(now.getTime() + windowMinutes * 60 * 1000);

    logger.debug(`[CRON] Checking for appointments between ${windowStart.toUTCString()} and ${windowEnd.toUTCString()}`);

    const appointments = await appointmentRepository.findUpcomingUnreminded(windowStart, windowEnd);

    if (appointments.length === 0) {
      logger.debug('[CRON] No pending reminders found');
      return;
    }

    logger.info(`[CRON] Found ${appointments.length} appointment(s) to remind`);

    for (const appt of appointments) {
      whatsappService.sendReminder(appt.phone, appt.customerName, appt.appointmentTime);
      emailService.sendReminderEmail(appt.email, appt.customerName, appt.appointmentTime);
      await appointmentRepository.markReminderSent(appt._id);
      logger.info(`[CRON] Marked reminder sent for: ${appt.customerName}`);
    }
  } catch (error) {
    logger.error(`[CRON] Reminder job failed: ${error.message}`);
    throw error;
  }
};
