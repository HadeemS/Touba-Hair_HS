import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const envPathServer = join(__dirname, '..', '.env');
const envPathRoot = join(__dirname, '..', '..', '.env');

if (existsSync(envPathServer)) {
  dotenv.config({ path: envPathServer });
} else if (existsSync(envPathRoot)) {
  dotenv.config({ path: envPathRoot });
} else {
  dotenv.config();
}

async function checkEmployees() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not set');
      process.exit(1);
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000
    });
    console.log('✅ Connected to MongoDB\n');

    // Get all employees and admins
    const employees = await User.find({
      $or: [
        { role: 'employee' },
        { role: 'admin' }
      ]
    }).select('name fullName username location role isActive forcePasswordChange');

    console.log(`📊 Found ${employees.length} employees/admins:\n`);

    if (employees.length === 0) {
      console.log('⚠️  No employees found in database!');
    } else {
      // Group by location
      const byLocation = {};
      employees.forEach(emp => {
        const loc = emp.location || 'No Location';
        if (!byLocation[loc]) byLocation[loc] = [];
        byLocation[loc].push(emp);
      });

      Object.keys(byLocation).sort().forEach(location => {
        console.log(`📍 ${location} (${byLocation[location].length}):`);
        byLocation[location].forEach(emp => {
          const status = emp.isActive ? '✅' : '❌';
          const pwdChange = emp.forcePasswordChange ? '🔑' : '';
          console.log(`   ${status} ${pwdChange} ${emp.fullName || emp.name} (${emp.username || 'no username'}) - ${emp.role}`);
        });
        console.log();
      });

      // Check for issues
      console.log('\n🔍 Checking for issues...\n');
      
      const noUsername = employees.filter(e => !e.username);
      const noLocation = employees.filter(e => !e.location && (e.role === 'employee' || e.role === 'admin'));
      const inactive = employees.filter(e => !e.isActive);

      if (noUsername.length > 0) {
        console.log(`⚠️  ${noUsername.length} users without username:`);
        noUsername.forEach(u => console.log(`   - ${u.fullName || u.name}`));
        console.log();
      }

      if (noLocation.length > 0) {
        console.log(`⚠️  ${noLocation.length} employees without location:`);
        noLocation.forEach(u => console.log(`   - ${u.fullName || u.name}`));
        console.log();
      }

      if (inactive.length > 0) {
        console.log(`⚠️  ${inactive.length} inactive employees:`);
        inactive.forEach(u => console.log(`   - ${u.fullName || u.name}`));
        console.log();
      }

      if (noUsername.length === 0 && noLocation.length === 0 && inactive.length === 0) {
        console.log('✅ No issues found! All employees look good.\n');
      }
    }

    await mongoose.disconnect();
    console.log('✅ Check complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkEmployees();

