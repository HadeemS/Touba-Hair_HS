# How to Check MongoDB Connection Status

## Quick Check Methods

### 1. **Check Server Logs** (Easiest)

When you start your server, look for these messages:

**✅ Connected Successfully:**
```
═══════════════════════════════════════════════════════════
✅ MongoDB Connected Successfully!
═══════════════════════════════════════════════════════════
📊 Database Name: touba-hair
🌐 Host: cluster0.er5izge.mongodb.net
🔌 Connection State: Connected (Ready)
💾 Ready to accept database operations
═══════════════════════════════════════════════════════════
```

**❌ Connection Failed:**
```
═══════════════════════════════════════════════════════════
❌ MongoDB Connection Failed!
═══════════════════════════════════════════════════════════
```

### 2. **Use Health Check Endpoint**

Open in your browser or use curl:

**Health Check:**
```
https://touba-hair-hs-1.onrender.com/api/health
```

**Expected Response (Connected):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "database": {
    "status": "connected",
    "readyState": 1,
    "isConnected": true,
    "host": "cluster0.er5izge.mongodb.net",
    "name": "touba-hair"
  }
}
```

**Expected Response (Disconnected):**
```json
{
  "status": "degraded",
  "database": {
    "status": "disconnected",
    "readyState": 0,
    "isConnected": false,
    "message": "MongoDB is disconnected. Check connection string and network access."
  }
}
```

### 3. **Test Database Connection**

**Test Endpoint:**
```
https://touba-hair-hs-1.onrender.com/api/test-db
```

This will:
- Check if MongoDB is connected
- Try a ping operation
- List available collections
- Provide troubleshooting tips if connection fails

### 4. **Check Login Error Messages**

If login fails, check the error message:

**MongoDB Not Connected:**
```json
{
  "error": "Database connection unavailable. Please try again later.",
  "databaseStatus": "disconnected"
}
```

**MongoDB Connection Error:**
```json
{
  "error": "Database connection error. Please try again later."
}
```

## Common Issues and Solutions

### Issue 1: "Database connection unavailable"

**Causes:**
- MongoDB URI not set in environment variables
- Connection string is incorrect
- MongoDB Atlas IP whitelist blocking your server

**Solutions:**
1. Check Render environment variables:
   - Go to Render Dashboard → Your Service → Environment
   - Verify `MONGODB_URI` is set
   - Value should be: `mongodb+srv://[your-username]:[your-password]@cluster0.er5izge.mongodb.net/touba-hair?retryWrites=true&w=majority`
     - Replace `[your-username]` and `[your-password]` with your actual MongoDB credentials

2. Check MongoDB Atlas IP Whitelist:
   - Go to MongoDB Atlas → Network Access
   - Add `0.0.0.0/0` (allows all IPs) OR your Render IP address

### Issue 2: "Invalid email or password" (but MongoDB might be disconnected)

**Check:**
- First verify MongoDB is connected using `/api/health`
- If MongoDB is disconnected, login will fail even with correct credentials

### Issue 3: Connection works locally but not on Render

**Causes:**
- Environment variable not set in Render
- Different connection string needed

**Solutions:**
1. Set `MONGODB_URI` in Render environment variables
2. Make sure connection string includes database name
3. Check Render logs for connection errors

## Step-by-Step Verification

### Step 1: Check Server Status
```bash
curl https://touba-hair-hs-1.onrender.com/api/health
```

### Step 2: Test Database Connection
```bash
curl https://touba-hair-hs-1.onrender.com/api/test-db
```

### Step 3: Check Render Logs
1. Go to Render Dashboard
2. Select your service
3. Click "Logs" tab
4. Look for MongoDB connection messages

### Step 4: Verify Environment Variables
1. Go to Render Dashboard
2. Select your service
3. Click "Environment" tab
4. Verify `MONGODB_URI` is set correctly

## MongoDB Connection States

- **0 = disconnected** - Not connected to MongoDB
- **1 = connected** - Successfully connected ✅
- **2 = connecting** - Currently attempting to connect
- **3 = disconnecting** - Currently disconnecting

## Quick Test Commands

**Using curl:**
```bash
# Health check
curl https://touba-hair-hs-1.onrender.com/api/health

# Database test
curl https://touba-hair-hs-1.onrender.com/api/test-db
```

**Using browser:**
Just open these URLs:
- `https://touba-hair-hs-1.onrender.com/api/health`
- `https://touba-hair-hs-1.onrender.com/api/test-db`

## Still Having Issues?

1. **Check Render Logs** - Most detailed error information
2. **Check MongoDB Atlas** - Verify cluster is running
3. **Verify IP Whitelist** - Must include Render IP or 0.0.0.0/0
4. **Test Connection String** - Try connecting with MongoDB Compass
5. **Check Environment Variables** - Ensure MONGODB_URI is set correctly

---

**Last Updated**: Current date
**Health Check Endpoint**: `/api/health`
**Database Test Endpoint**: `/api/test-db`

