import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  fullName: {
    type: String,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    sparse: true, // Allow null values but enforce uniqueness when present
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9]+$/, 'Username must contain only lowercase letters and numbers']
  },
  email: {
    type: String,
    required: function() {
      // Email required for clients, optional for employees
      return this.role === 'client';
    },
    unique: true,
    sparse: true, // Allow null values but enforce uniqueness when present
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      // Password required for employees and admins
      return this.role === 'employee' || this.role === 'admin';
    },
    minlength: [10, 'Password must be at least 10 characters']
  },
  role: {
    type: String,
    enum: ['client', 'employee', 'admin'],
    default: 'client',
    required: true
  },
  location: {
    type: String,
    enum: ['Sandhills', 'Two Notch', null],
    default: null,
    required: function() {
      // Location required for employees
      return this.role === 'employee' || this.role === 'admin';
    }
  },
  forcePasswordChange: {
    type: Boolean,
    default: false
  },
  // For employees: link to braider profile
  braiderId: {
    type: String,
    default: null
  },
  // Profile info
  notes: {
    type: String,
    default: ''
  },
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  if (this.password) {
    // Validate password strength for employees/admins
    if (this.role === 'employee' || this.role === 'admin') {
      // Password must be at least 10 characters, contain at least 1 number and 1 letter
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{10,}$/;
      if (!passwordRegex.test(this.password)) {
        return next(new Error('Password must be at least 10 characters and contain at least one letter and one number'));
      }
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Update updatedAt on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  // Include forcePasswordChange for frontend to check
  return obj;
};

// Static method to generate username from name
userSchema.statics.generateUsername = function(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove punctuation
    .replace(/\s+/g, '') // Remove spaces
    .trim();
};

export default mongoose.model('User', userSchema);

