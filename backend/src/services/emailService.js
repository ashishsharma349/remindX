const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send confirmation email
exports.sendConfirmationEmail = async (toEmail, name, time) => {
  try {
    const info = await transporter.sendMail({
      from: `"RemindX" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Appointment Confirmation - RemindX',
      text: `Hi ${name},\n\nYour appointment is confirmed for ${new Date(time).toUTCString()}.\n\nThank you for choosing RemindX!`
    });
    logger.info(`[EMAIL CONFIRMATION] Sent to: ${toEmail} | ID: ${info.messageId}`);
  } catch (error) {
    logger.error(`[EMAIL CONFIRMATION ERROR] ${error.message}`);
  }
};

// Send reminder email
exports.sendReminderEmail = async (toEmail, name, time) => {
  try {
    const info = await transporter.sendMail({
      from: `"RemindX" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Appointment Reminder - RemindX',
      text: `Hi ${name},\n\nThis is a reminder from RemindX that you have an appointment coming up at ${new Date(time).toUTCString()}.\n\nSee you soon!`
    });
    logger.info(`[EMAIL REMINDER] Sent to: ${toEmail} | ID: ${info.messageId}`);
  } catch (error) {
    logger.error(`[EMAIL REMINDER ERROR] ${error.message}`);
  }
};
