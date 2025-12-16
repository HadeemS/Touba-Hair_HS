# Getting Your Server Online

## Quick Check: Is Render Service Running?

Your backend is hosted on Render at: `https://touba-hair-hs-1.onrender.com`

### Step 1: Check Render Dashboard

1. **Go to [Render Dashboard](https://dashboard.render.com)**
2. **Find your service** (should be named something like `touba-hair-hs-1` or similar)
3. **Check the status**:
   - ✅ **Live** = Server is running
   - ⏸️ **Sleeping** = Free tier service that sleeps after 15 min inactivity
   - ❌ **Failed** = Deployment error

### Step 2: If Service is Sleeping

**Free tier services on Render sleep after 15 minutes of inactivity.**

**Solutions:**
1. **Wait 30-60 seconds** after visiting the site - the first request wakes it up
2. **Manually wake it up**:
   - Go to Render dashboard
   - Click on your service
   - Click "Manual Deploy" → "Deploy latest commit"
   - Or just visit the URL: `https://touba-hair-hs-1.onrender.com/api/health`

### Step 3: If Service Shows "Failed"

**Check the logs:**
1. In Render dashboard, click on your service
2. Go to "Logs" tab
3. Look for errors (usually red text)

**Common issues:**
- **MongoDB connection error**: Check `MONGODB_URI` environment variable
- **Port error**: Render sets PORT automatically, don't override it
- **Build error**: Check that `cd server && npm install` works

### Step 4: Verify Environment Variables

In Render dashboard → Your Service → Environment:

**Required:**
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens (any random string)
- `FRONTEND_URL` - `https://hadeems.github.io/Touba-Hair_HS`

**Optional:**
- `NODE_ENV` - Set to `production` for production

### Step 5: Test the Server

**Test if server is responding:**
```bash
# In browser, visit:
https://touba-hair-hs-1.onrender.com/api/health

# Should return:
{"status":"ok","database":{"isConnected":true}}
```

**If it times out or errors:**
- Service is sleeping (wait 30-60 seconds)
- Service is down (check Render dashboard)
- Service failed to deploy (check logs)

### Step 6: Force Wake Up (Free Tier)

Since free tier services sleep, you can:

1. **Set up a ping service** (keeps it awake):
   - Use [UptimeRobot](https://uptimerobot.com) (free)
   - Set it to ping `https://touba-hair-hs-1.onrender.com/api/health` every 5 minutes

2. **Upgrade to paid tier** (always-on service)

### Step 7: Check Frontend Connection

**Verify frontend is pointing to correct URL:**

1. Check `src/utils/api.js` - should have:
   ```javascript
   const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://touba-hair-hs-1.onrender.com';
   ```

2. If you have a `.env` file, make sure it has:
   ```
   VITE_API_URL=https://touba-hair-hs-1.onrender.com
   ```

3. **Rebuild frontend** if you changed `.env`:
   ```bash
   npm run build
   npm run deploy
   ```

## Quick Fix Checklist

- [ ] Check Render dashboard - is service running?
- [ ] If sleeping, wait 30-60 seconds after first request
- [ ] Check environment variables (MONGODB_URI, JWT_SECRET)
- [ ] Check Render logs for errors
- [ ] Test `/api/health` endpoint in browser
- [ ] Verify frontend API URL is correct
- [ ] Rebuild and redeploy frontend if needed

## Still Not Working?

1. **Check Render logs** - Most errors show up there
2. **Verify MongoDB connection** - Make sure MONGODB_URI is correct
3. **Check CORS settings** - Should allow your GitHub Pages URL
4. **Test locally first**:
   ```bash
   cd server
   npm install
   npm start
   ```
   Then visit `http://localhost:3000/api/health`


