# Fix MongoDB Connection Issues

## Current Errors

1. **Trust Proxy Error** - ✅ FIXED (moved `trust proxy` before middleware)
2. **MongoDB Connection Timeout** - Need to verify connection string

## Steps to Fix MongoDB Connection

### Step 1: Verify Connection String Format

Your connection string should be:
```
mongodb+srv://Hvdeem:YOUR_PASSWORD@toubacluster.enbxk.mongodb.net/touba-hair?retryWrites=true&w=majority
```

**Important parts:**
- `Hvdeem` - your username ✅
- `YOUR_PASSWORD` - replace with actual password
- `toubacluster.enbxk.mongodb.net` - your cluster ✅
- `/touba-hair` - database name (MUST be included)
- `?retryWrites=true&w=majority` - connection options

### Step 2: Check Render Environment Variable

1. Go to: https://dashboard.render.com
2. Click your service: `touba-hair-hs-1`
3. Go to **"Environment"** tab
4. Find `MONGODB_URI`
5. Verify it:
   - ✅ Has your actual password (not `<db_password>`)
   - ✅ Includes `/touba-hair` before the `?`
   - ✅ Has `?retryWrites=true&w=majority` at the end
   - ✅ No extra spaces or quotes

### Step 3: URL Encode Password (if needed)

If your password has special characters, encode them:
- `@` → `%40`
- `#` → `%23`
- `!` → `%21`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`

**Example:**
- Password: `MyPass@123#`
- Encoded: `MyPass%40123%23`

### Step 4: Verify MongoDB Atlas Settings

1. **IP Whitelist:**
   - Go to MongoDB Atlas → Network Access
   - Make sure `0.0.0.0/0` is added (allows all IPs)
   - Or add Render's specific IPs

2. **Database User:**
   - Go to MongoDB Atlas → Database Access
   - Verify user `Hvdeem` exists
   - Verify password is correct
   - User should have "Read and write to any database" permissions

### Step 5: Test Connection String

After updating Render, check logs:
1. Go to Render dashboard
2. Click "Logs" tab
3. Look for:
   - ✅ `Connected to MongoDB` - Success!
   - ❌ `MongoDB connection error` - Check error message

### Step 6: Common Issues

**"Operation buffering timed out":**
- Connection string is wrong
- IP not whitelisted
- Password incorrect
- Network/firewall blocking

**"Authentication failed":**
- Wrong username or password
- Password needs URL encoding
- User doesn't have permissions

**"Server selection timed out":**
- IP whitelist issue
- Network connectivity problem
- Cluster might be paused (free tier)

## Quick Test

After updating Render, test the health endpoint:
```
https://touba-hair-hs-1.onrender.com/api/health
```

Should show: `"database": "connected"`

## Example Connection String

If your password is `MyPassword123`, your connection string should be:
```
mongodb+srv://Hvdeem:MyPassword123@toubacluster.enbxk.mongodb.net/touba-hair?retryWrites=true&w=majority
```

If your password is `Pass@123#`, encode it:
```
mongodb+srv://Hvdeem:Pass%40123%23@toubacluster.enbxk.mongodb.net/touba-hair?retryWrites=true&w=majority
```

