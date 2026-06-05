const Appointment = require('../models/Appointment');

class AppointmentRepository {
  async create(data) {
    return Appointment.create(data);
  }

  async findAll({ filter = {}, skip = 0, limit = 10, sort = { appointmentTime: -1 } }) {
    return Appointment.find(filter).sort(sort).skip(skip).limit(limit).lean();
  }

  async countDocuments(filter = {}) {
    return Appointment.countDocuments(filter);
  }

  async findById(id) {
    return Appointment.findById(id).lean();
  }

  async findUpcomingUnreminded(windowStart, windowEnd) {
    return Appointment.find({
      appointmentTime: { $gte: windowStart, $lte: windowEnd },
      reminderSent: false
    }).lean();
  }

  async markReminderSent(id) {
    return Appointment.findByIdAndUpdate(id, { reminderSent: true }, { new: true });
  }
}

module.exports = new AppointmentRepository();
