// Script to create an employee account
// Usage: node scripts/createEmployee.js <name> <email> <password> <braiderId>

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

async function createEmployee() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get employee details from command line
    const args = process.argv.slice(2);
    
    if (args.length < 3) {
      console.log('Usage: node scripts/createEmployee.js <name> <email> <password> [braiderId]');
      console.log('Example: node scripts/createEmployee.js "Amina" "amina@toubahair.com" "password123" "1"');
      process.exit(1);
    }

    const name = args[0];
    const email = args[1];
    const password = args[2];
    const braiderId = args[3] || null;

    // Check if employee already exists
    const existingEmployee = await User.findOne({ email: email.toLowerCase() });
    if (existingEmployee) {
      console.log('❌ User with this email already exists!');
      process.exit(1);
    }

    // Create employee user
    const employee = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: 'employee',
      braiderId: braiderId,
      isActive: true
    });

    await employee.save();
    console.log('✅ Employee account created successfully!');
    console.log(`   Name: ${name}`);
    console.log(`   Email: ${email}`);
    console.log(`   Braider ID: ${braiderId || 'Not set'}`);
    console.log('⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating employee:', error);
    process.exit(1);
  }
}

createEmployee();

