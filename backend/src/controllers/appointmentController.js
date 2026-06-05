const appointmentService = require('../services/appointmentService');
const emailService = require('../services/emailService');

class AppointmentController {
  async create(req, res, next) {
    try {
      const { customerName, phone, email, appointmentTime } = req.body;

      // Required fields
      if (!customerName || !phone || !email || !appointmentTime) {
        return res.status(400).json({
          ok: false,
          message: 'Missing required fields: customerName, phone, email, appointmentTime'
        });
      }

      // Type safety — prevent NoSQL injection
      if (typeof customerName !== 'string' || typeof phone !== 'string' || typeof email !== 'string' || typeof appointmentTime !== 'string') {
        return res.status(400).json({
          ok: false,
          message: 'Invalid field types: all fields must be strings'
        });
      }

      // Validate email format (must be Gmail)
      const emailRegex = /^[^\s@]+@gmail\.com$/i;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          ok: false,
          message: 'Please use a valid @gmail.com address'
        });
      }

      // Appointment must be in the future
      const parsedTime = new Date(appointmentTime);
      if (isNaN(parsedTime.getTime()) || parsedTime <= new Date()) {
        return res.status(400).json({
          ok: false,
          message: 'Appointment time must be a valid future date'
        });
      }

      const appointment = await appointmentService.createAppointment({
        customerName: customerName.trim(),
        phone,
        email,
        appointmentTime
      });

      await emailService.sendConfirmationEmail(email, customerName, appointmentTime);

      return res.status(201).json({
        ok: true,
        message: 'Appointment created successfully',
        data: appointment
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = Math.min(parseInt(req.query.limit) || 10, 50);
      const { customerName, date } = req.query;

      const result = await appointmentService.getAppointments({
        page,
        limit,
        customerName,
        date
      });

      return res.status(200).json({
        ok: true,
        message: 'Appointments retrieved successfully',
        data: result.appointments,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const appointment = await appointmentService.getAppointmentById(req.params.id);

      return res.status(200).json({
        ok: true,
        message: 'Appointment retrieved successfully',
        data: appointment
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AppointmentController();
