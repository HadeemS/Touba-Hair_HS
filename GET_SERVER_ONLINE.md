# How to Get Your Server Online

Your backend is deployed on Render at: `https://touba-hair-hs-1.onrender.com`

## Quick Fix: Wake Up Your Server

### Option 1: Visit the Render Dashboard
1. Go to [render.com](https://render.com) and log in
2. Find your service: **touba-hair-api** (or **touba-hair-hs-1**)
3. Click on the service
4. Click **"Manual Deploy"** → **"Deploy latest commit"** to wake it up
5. Wait 1-2 minutes for the service to start

### Option 2: Make a Request to Wake It Up
The service will automatically wake up when you make a request. Try:
- Visit: `https://touba-hair-hs-1.onrender.com/api/health` in your browser
- Wait 30-60 seconds for the first request (cold start)
- Refresh your login page

### Option 3: Check Service Status
1. In Render dashboard, check if the service shows:
   - ✅ **Live** (green) = Running
   - ⏸️ **Suspended** = Sleeping (needs wake up)
   - ❌ **Failed** = Error (check logs)

## Verify Environment Variables

Make sure these are set in Render Dashboard → Environment:

1. **MONGODB_URI** - Your MongoDB Atlas connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/touba-hair?retryWrites=true&w=majority`

2. **JWT_SECRET** - A random secret string (at least 32 characters)
   - Generate one: `openssl rand -base64 32`
   - Or use: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`

3. **FRONTEND_URL** - Your frontend URL
   - Should be: `https://hadeems.github.io,https://hadeems.github.io/Touba-Hair_HS`

4. **NODE_ENV** - Set to `production`

## Check Server Logs

1. In Render dashboard → Your service → **Logs** tab
2. Look for:
   - ✅ `Server running on port XXXX`
   - ✅ `MongoDB connected successfully`
   - ❌ Any error messages

## Test Your Server

Once the service is awake, test these URLs:

1. **Health Check**: `https://touba-hair-hs-1.onrender.com/api/health`
   - Should return: `{"status":"ok","database":{"isConnected":true}}`

2. **Root**: `https://touba-hair-hs-1.onrender.com/`
   - Should return API info

3. **Test Database**: `https://touba-hair-hs-1.onrender.com/api/test-db`
   - Should return database connection status

## Common Issues

### Server Always Sleeping
- **Solution**: Upgrade to a paid plan, or accept the 30-60 second cold start delay

### MongoDB Connection Failed
- Check `MONGODB_URI` is set correctly
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0` (all IPs)
- Check MongoDB Atlas cluster is running

### CORS Errors
- Verify `FRONTEND_URL` includes your GitHub Pages URL
- Check the URL format matches exactly (no trailing slashes)

### 503 Service Unavailable
- Service is starting up (wait 1-2 minutes)
- Service crashed (check logs)
- Environment variables missing (check Render dashboard)

## Quick Health Check Script

You can test your server from the command line:

```bash
# Test health endpoint
curl https://touba-hair-hs-1.onrender.com/api/health

# Test database connection
curl https://touba-hair-hs-1.onrender.com/api/test-db
```

## Next Steps

Once your server is online:
1. The login page should automatically detect it
2. You can log in with demo accounts
3. All API calls should work

If you're still having issues, check the Render logs for specific error messages.


