import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Employee data
const employees = {
  Sandhills: [
    'Jabu',
    'Sophia',
    'Ndeye',
    'Sidoline',
    'Kenzie',
    'Mayeissa',
    'Mounas',
    'Ramatoulie',
    'Aicha'
  ],
  'Two Notch': [
    'Guest 1',
    'Guest 2',
    'Aunty Maria',
    'Fatima',
    'Fa',
    'Mama Ndiaye',
    'Yuma',
    'Mengue',
    'Ta Fatou',
    'Ta Awa',
    'Ta Marie',
    'Mariam',
    'Touba Secondary Admin', // Admin role
    'Aja',
    'Maye',
    'Astou'
  ]
};

// Generate username from name
function generateUsername(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove punctuation
    .replace(/\s+/g, '') // Remove spaces
    .trim();
}

// Generate temp password
function generateTempPassword() {
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `Touba!${randomSuffix}`;
}

async function seedEmployees() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/touba-hair';
    
    // Fix MongoDB connection string if needed
    let finalUri = MONGODB_URI;
    if (MONGODB_URI.includes('mongodb+srv://')) {
      const dbName = process.env.MONGODB_DB_NAME || 'touba-hair';
      const match = MONGODB_URI.match(/mongodb\+srv:\/\/([^@]+)@([^/?]+)(\/[^?]*)?(\?.*)?/);
      if (match) {
        const credentials = match[1];
        const host = match[2];
        const queryString = match[4] || '';
        finalUri = `mongodb+srv://${credentials}@${host}/${dbName}${queryString}`;
      }
    }

    await mongoose.connect(finalUri);
    console.log('✅ Connected to MongoDB');

    const results = [];
    const credentials = [];

    // Process each location
    for (const [location, names] of Object.entries(employees)) {
      console.log(`\n📍 Processing ${location} location...`);

      for (const fullName of names) {
        try {
          // Determine role
          const role = fullName === 'Touba Secondary Admin' ? 'admin' : 'employee';
          
          // Generate username
          let username = generateUsername(fullName);
          
          // Check for duplicates and append number if needed
          let finalUsername = username;
          let counter = 1;
          while (await User.findOne({ username: finalUsername })) {
            finalUsername = `${username}${counter}`;
            counter++;
          }

          // Check if user already exists
          const existingUser = await User.findOne({
            $or: [
              { username: finalUsername },
              { fullName: fullName },
              { name: fullName }
            ]
          });

          const tempPassword = generateTempPassword();

          if (existingUser) {
            // Update existing user
            existingUser.fullName = fullName;
            existingUser.name = fullName; // Keep for backward compatibility
            existingUser.username = finalUsername;
            existingUser.location = location;
            existingUser.role = role;
            existingUser.password = tempPassword;
            existingUser.forcePasswordChange = true;
            existingUser.isActive = true;
            await existingUser.save();

            results.push({
              action: 'updated',
              fullName,
              username: finalUsername,
              location,
              role,
              tempPassword
            });

            console.log(`  ✅ Updated: ${fullName} (${finalUsername}) - ${role}`);
          } else {
            // Create new user
            const user = new User({
              name: fullName,
              fullName,
              username: finalUsername,
              location,
              role,
              password: tempPassword,
              forcePasswordChange: true,
              isActive: true
            });

            await user.save();

            results.push({
              action: 'created',
              fullName,
              username: finalUsername,
              location,
              role,
              tempPassword
            });

            console.log(`  ✅ Created: ${fullName} (${finalUsername}) - ${role}`);
          }

          credentials.push({
            fullName,
            username: finalUsername,
            location,
            role,
            tempPassword
          });
        } catch (error) {
          console.error(`  ❌ Error processing ${fullName}:`, error.message);
          results.push({
            action: 'error',
            fullName,
            error: error.message
          });
        }
      }
    }

    // Generate CSV output
    const csvHeader = 'Full Name,Username,Location,Role,Temp Password\n';
    const csvRows = credentials.map(cred => 
      `"${cred.fullName}","${cred.username}","${cred.location}","${cred.role}","${cred.tempPassword}"`
    ).join('\n');
    const csvContent = csvHeader + csvRows;

    // Write to file (gitignored)
    const csvPath = join(__dirname, '..', 'employee_credentials.csv');
    fs.writeFileSync(csvPath, csvContent, 'utf8');
    console.log(`\n📄 Credentials saved to: ${csvPath}`);

    // Print summary
    console.log('\n📊 Summary:');
    console.log(`  Created: ${results.filter(r => r.action === 'created').length}`);
    console.log(`  Updated: ${results.filter(r => r.action === 'updated').length}`);
    console.log(`  Errors: ${results.filter(r => r.action === 'error').length}`);

    console.log('\n🔐 Temporary Passwords (also saved to CSV):');
    console.log('─'.repeat(80));
    credentials.forEach(cred => {
      console.log(`${cred.fullName.padEnd(25)} | ${cred.username.padEnd(20)} | ${cred.location.padEnd(12)} | ${cred.role.padEnd(8)} | ${cred.tempPassword}`);
    });
    console.log('─'.repeat(80));
    console.log('\n⚠️  IMPORTANT: Users must change their password on first login!');
    console.log('⚠️  Keep the CSV file secure and do NOT commit it to git!');

    await mongoose.disconnect();
    console.log('\n✅ Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedEmployees();
}

export default seedEmployees;

