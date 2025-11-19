import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Optional for guest bookings
    default: null
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Will be set when employee is found
    default: null
  },
  braiderId: {
    type: String,
    required: [true, 'Braider ID is required']
  },
  braiderName: {
    type: String,
    required: [true, 'Braider name is required']
  },
  // Store date and time separately for easier querying
  date: {
    type: String, // Format: YYYY-MM-DD
    required: [true, 'Date is required']
  },
  timeSlot: {
    type: String, // Format: "HH:MM AM/PM"
    required: [true, 'Time slot is required']
  },
  // Combined datetime for sorting
  dateTime: {
    type: Date,
    required: [true, 'DateTime is required']
  },
  // Customer info (denormalized for easier access)
  customerName: {
    type: String,
    required: [true, 'Customer name is required']
  },
  customerEmail: {
    type: String,
    required: [true, 'Customer email is required']
  },
  customerPhone: {
    type: String,
    required: [true, 'Customer phone is required']
  },
  // Service info
  serviceName: {
    type: String,
    default: 'Hair Braiding'
  },
  servicePrice: {
    type: Number,
    default: 0
  },
  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'confirmed'
  },
  // Notes
  notes: {
    type: String,
    default: ''
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // Cancellation info
  cancelledAt: {
    type: Date,
    default: null
  },
  cancelledBy: {
    type: String, // 'client' or 'employee'
    default: null
  }
});

// Update updatedAt on save
appointmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
appointmentSchema.index({ date: 1, timeSlot: 1, braiderId: 1 });
appointmentSchema.index({ clientId: 1, dateTime: -1 });
appointmentSchema.index({ employeeId: 1, dateTime: -1 });
appointmentSchema.index({ status: 1 });

export default mongoose.model('Appointment', appointmentSchema);

