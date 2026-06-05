const logger = require('../utils/logger');

class WhatsAppService {
  /**
   * Simulates sending a WhatsApp confirmation message.
   * In production, this would call the Twilio / Meta API.
   */
  sendConfirmation(phone, customerName, appointmentTime) {
    const message = `Hi ${customerName}, confirmation from RemindX — your appointment is scheduled for ${appointmentTime.toUTCString()}. We look forward to seeing you!`;
    logger.info(`[WHATSAPP CONFIRMATION] To: ${phone} | Message: "${message}"`);
  }

  /**
   * Simulates sending a WhatsApp reminder message.
   */
  sendReminder(phone, customerName, appointmentTime) {
    const message = `Hi ${customerName}, reminder from RemindX — you have an appointment at ${appointmentTime.toUTCString()}. See you soon!`;
    logger.info(`[WHATSAPP REMINDER] To: ${phone} | Message: "${message}"`);
  }
}

module.exports = new WhatsAppService();
