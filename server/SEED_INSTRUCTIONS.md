# How to Seed Employees

## Problem
The braiders aren't appearing because the employees haven't been seeded into the database yet.

## Solution

### Step 1: Create a `.env` file in the `server` directory

Create a file named `.env` in the `server` folder with your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/touba-hair?retryWrites=true&w=majority
```

**Important:** Replace `username`, `password`, and `cluster.mongodb.net` with your actual MongoDB Atlas credentials.

### Step 2: Run the seed script

From the `server` directory, run:

```bash
node scripts/seedEmployees.js
```

You should see output like:
```
📄 Loaded .env from server directory
🔌 Connecting to MongoDB...
✅ Connected to MongoDB

📍 Processing Sandhills location...
  ✅ Created: Jabu (jabu) - employee
  ✅ Created: Sophia (sophia) - employee
  ...

📊 Summary:
  Created: 25
  Updated: 0
  Errors: 0
```

### Step 3: Check the credentials

The script will create a file `server/employee_credentials.csv` with all usernames and temporary passwords.

**Important:** 
- All employees must change their password on first login
- Keep the CSV file secure and do NOT commit it to git

### Step 4: Verify braiders appear

After seeding, refresh your booking page. You should see all 25 employees grouped by location (Sandhills and Two Notch).

## Troubleshooting

### Error: "MONGODB_URI environment variable is not set"
- Make sure you created the `.env` file in the `server` directory
- Make sure the file is named exactly `.env` (not `.env.txt` or anything else)
- Check that `MONGODB_URI=...` is on a single line

### Error: "connect ECONNREFUSED"
- Your MongoDB connection string might be incorrect
- Check that your MongoDB Atlas cluster is running
- Verify your IP address is whitelisted in MongoDB Atlas (use `0.0.0.0/0` for all IPs)

### Braiders still don't appear after seeding
- Check your server logs to see if the API is returning braiders
- Visit `/api/braiders` in your browser to see the raw API response
- Make sure your server is connected to the same MongoDB database

