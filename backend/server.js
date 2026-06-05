require('dotenv').config();
const app = require('./app');
const connectDB = require('./src/config/db');
const startReminderJob = require('./src/jobs/reminderJob');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  startReminderJob();

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
  });
};

start();
