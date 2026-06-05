const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true
    },
    appointmentTime: {
      type: Date,
      required: [true, 'Appointment time is required']
    },
    reminderSent: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Compound index for the cron job: find upcoming un-reminded appointments fast
appointmentSchema.index({ appointmentTime: 1, reminderSent: 1 });

// Indexes for dashboard filters
appointmentSchema.index({ customerName: 1 });
appointmentSchema.index({ appointmentTime: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
