const appointmentRepository = require('../repositories/appointmentRepository');
const whatsappService = require('./whatsappService');

class AppointmentService {
  async createAppointment({ customerName, phone, email, appointmentTime }) {
    const appointment = await appointmentRepository.create({
      customerName,
      phone,
      email,
      appointmentTime: new Date(appointmentTime)
    });

    // Simulate WhatsApp confirmation on save
    whatsappService.sendConfirmation(phone, customerName, appointment.appointmentTime);

    return appointment;
  }

  async getAppointments({ page = 1, limit = 10, customerName, date }) {
    const filter = {};

    if (customerName) {
      filter.customerName = { $regex: customerName, $options: 'i' };
    }

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setUTCHours(23, 59, 59, 999);
      filter.appointmentTime = { $gte: start, $lte: end };
    }

    const skip = (page - 1) * limit;

    const [appointments, total] = await Promise.all([
      appointmentRepository.findAll({ filter, skip, limit }),
      appointmentRepository.countDocuments(filter)
    ]);

    return {
      appointments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getAppointmentById(id) {
    const appointment = await appointmentRepository.findById(id);
    if (!appointment) {
      const error = new Error('Appointment not found');
      error.statusCode = 404;
      throw error;
    }
    return appointment;
  }
}

module.exports = new AppointmentService();
