// Script to create an admin account
// Usage: node scripts/createAdmin.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/touba-hair';

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get admin details from command line or use defaults
    const args = process.argv.slice(2);
    const name = args[0] || 'Admin User';
    const email = args[1] || 'admin@toubahair.com';
    const password = args[2] || 'admin123';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      console.log('❌ Admin with this email already exists!');
      process.exit(1);
    }

    // Create admin user
    const admin = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: 'admin',
      isActive: true
    });

    await admin.save();
    console.log('✅ Admin account created successfully!');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();

