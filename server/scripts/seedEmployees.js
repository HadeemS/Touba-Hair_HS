import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables - check both server and root directories
const envPathServer = join(__dirname, '..', '.env');
const envPathRoot = join(__dirname, '..', '..', '.env');

if (existsSync(envPathServer)) {
  dotenv.config({ path: envPathServer });
  console.log('📄 Loaded .env from server directory');
} else if (existsSync(envPathRoot)) {
  dotenv.config({ path: envPathRoot });
  console.log('📄 Loaded .env from root directory');
} else {
  dotenv.config(); // Try default location
  console.log('⚠️  No .env file found, using environment variables or defaults');
}

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

// Generate temp password (must be 10+ chars with at least 1 letter and 1 number)
function generateTempPassword() {
  // Generate a random suffix that guarantees at least 1 letter and 1 number
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const randomLetter = letters[Math.floor(Math.random() * letters.length)];
  const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
  const randomChars = Math.random().toString(36).substring(2, 6); // 4 more random chars
  // Format: Touba! + randomLetter + randomNumber + randomChars (total: 6 + 1 + 1 + 4 = 12 chars)
  return `Touba!${randomLetter}${randomNumber}${randomChars}`;
}

async function seedEmployees() {
  try {
    // Connect to MongoDB - use same parsing logic as server.js
    let MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      console.error('❌ ERROR: MONGODB_URI environment variable is not set!');
      console.error('   Please create a .env file in the server directory with:');
      console.error('   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name');
      process.exit(1);
    }
    
    if (MONGODB_URI.includes('<db_password>')) {
      console.error('❌ ERROR: MONGODB_URI contains placeholder <db_password>');
      console.error('   Please replace it with your actual MongoDB password');
      process.exit(1);
    }
    
    // Validate connection string format
    if (!MONGODB_URI.includes('mongodb://') && !MONGODB_URI.includes('mongodb+srv://')) {
      console.error('❌ ERROR: MONGODB_URI must start with mongodb:// or mongodb+srv://');
      process.exit(1);
    }
    
    // Fix MongoDB connection string if needed (same logic as server.js)
    if (MONGODB_URI && !MONGODB_URI.includes('<db_password>')) {
      const dbName = process.env.MONGODB_DB_NAME || 'touba-hair';

      try {
        if (MONGODB_URI.includes('mongodb+srv://')) {
          // Extract components from mongodb+srv:// connection
          const match = MONGODB_URI.match(/mongodb\+srv:\/\/([^@]+)@([^/?]+)(\/[^?]*)?(\?.*)?/);

          if (match) {
            const credentials = match[1]; // username:password
            const host = match[2]; // cluster.mongodb.net
            const existingPath = match[3] || ''; // /database or empty
            const queryString = match[4] || ''; // ?options

            // Clean existing path (remove leading/trailing slashes)
            const cleanPath = existingPath.replace(/^\/+|\/+$/g, '');

            // Use existing database name if valid, otherwise use default
            const finalDbName = cleanPath && cleanPath.length > 0 ? cleanPath : dbName;

            // Validate hostname format
            if (!host.includes('.mongodb.net')) {
              console.error('❌ ERROR: Invalid MongoDB hostname. Should be: cluster0.xxxxx.mongodb.net');
              console.error(`   Found: ${host}`);
              process.exit(1);
            }

            // Reconstruct URI with proper format
            let newUri = `mongodb+srv://${credentials}@${host}/${finalDbName}`;

            // Add query parameters
            if (queryString) {
              if (!queryString.includes('retryWrites')) {
                newUri += `${queryString.includes('?') ? '&' : '?'}retryWrites=true&w=majority`;
              } else {
                newUri += queryString;
              }
            } else {
              newUri += `?retryWrites=true&w=majority`;
            }

            MONGODB_URI = newUri;
            console.log(`📝 Using database: ${finalDbName}`);
          } else {
            console.error('❌ ERROR: Could not parse mongodb+srv:// connection string');
            console.error('   Expected format: mongodb+srv://username:password@cluster.mongodb.net/database');
            process.exit(1);
          }
        } else if (MONGODB_URI.includes('mongodb://')) {
          // Standard MongoDB connection
          const match = MONGODB_URI.match(/mongodb:\/\/([^@]+@)?([^/]+)(\/[^?]*)?(\?.*)?/);

          if (match) {
            const auth = match[1] || ''; // username:password@ or empty
            const host = match[2]; // host:port
            const existingPath = match[3] || ''; // /database or empty
            const queryString = match[4] || ''; // ?options

            const cleanPath = existingPath.replace(/^\/+|\/+$/g, '');
            const finalDbName = cleanPath && cleanPath.length > 0 ? cleanPath : dbName;

            MONGODB_URI = `mongodb://${auth}${host}/${finalDbName}${queryString || ''}`;
            console.log(`📝 Using database: ${finalDbName}`);
          }
        }
      } catch (error) {
        console.error('❌ ERROR: Failed to parse MongoDB URI:', error.message);
        console.error('   Using original MONGODB_URI as-is');
      }
    }

    // Validate the final URI before connecting
    console.log('🔌 Connecting to MongoDB...');
    console.log(`   Host: ${MONGODB_URI.match(/@([^/]+)/)?.[1] || 'unknown'}`);
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000
    });
    console.log('✅ Connected to MongoDB');

    const results = [];
    const credentials = [];

    // Process each location
    for (const [location, names] of Object.entries(employees)) {
      console.log(`\n📍 Processing ${location} location...`);

      for (const fullName of names) {
        let finalUsername = 'unknown';
        try {
          // Determine role
          const role = fullName === 'Touba Secondary Admin' ? 'admin' : 'employee';
          
          // Generate username
          let username = generateUsername(fullName);
          
          // Check for duplicates and append number if needed
          finalUsername = username;
          let counter = 1;
          while (await User.findOne({ username: finalUsername })) {
            finalUsername = `${username}${counter}`;
            counter++;
          }

          // Generate a unique email for employees (to avoid null email conflicts)
          // Use username + location to make it unique
          const emailBase = finalUsername.replace(/\s+/g, '');
          const locationSlug = location.toLowerCase().replace(/\s+/g, '');
          const uniqueEmail = `${emailBase}@${locationSlug}.toubahair.local`;

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
            existingUser.email = uniqueEmail; // Set unique email to avoid null conflicts
            existingUser.location = location;
            existingUser.role = role;
            existingUser.password = tempPassword; // This will trigger password hashing
            existingUser.forcePasswordChange = true;
            existingUser.isActive = true;
            
            // Validate before saving
            const validationError = existingUser.validateSync();
            if (validationError) {
              throw new Error(`Validation failed: ${Object.values(validationError.errors).map(e => e.message).join(', ')}`);
            }
            
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
              email: uniqueEmail, // Set unique email to avoid null conflicts
              location,
              role,
              password: tempPassword,
              forcePasswordChange: true,
              isActive: true
            });

            // Validate before saving
            const validationError = user.validateSync();
            if (validationError) {
              throw new Error(`Validation failed: ${Object.values(validationError.errors).map(e => e.message).join(', ')}`);
            }

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
          const errorMsg = error.message || error.toString();
          console.error(`  ❌ Error processing ${fullName}:`, errorMsg);
          if (error.errors) {
            Object.keys(error.errors).forEach(key => {
              console.error(`     - ${key}: ${error.errors[key].message}`);
            });
          }
          results.push({
            action: 'error',
            fullName,
            username: finalUsername || 'unknown',
            error: errorMsg
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

// Always run when script is executed directly
seedEmployees().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

export default seedEmployees;


