# Deployment Guide - Render & Braiders

## 🚀 Do You Need to Deploy to Render to See Braiders?

### **YES - You need to deploy to Render for the braiders to appear on your live website.**

Here's why:

1. **Frontend calls the API**: Your React app calls `https://touba-hair-hs-1.onrender.com/api/braiders`
2. **Database is in the cloud**: Your MongoDB Atlas database is already in the cloud
3. **Employees are in the database**: You've seeded 25 employees into MongoDB Atlas
4. **Backend must be running**: The Render server needs to be running to serve the API

## 📋 Deployment Checklist

### Step 1: Set Environment Variables on Render

Go to your Render dashboard → Your service → Environment:

**Required Variables:**
```
MONGODB_URI=mongodb+srv://hadeemsecka_db_user:8fGIHbZ1cxZnCQWG@cluster0.er5izge.mongodb.net/touba-hair?retryWrites=true&w=majority
JWT_SECRET=your-random-secret-key-here
FRONTEND_URL=https://your-frontend-url.com
PORT=3000
```

**⚠️ Important:**
- Use the **same MongoDB connection string** you used locally
- Generate a new `JWT_SECRET` (random string)
- Set `FRONTEND_URL` to your frontend domain

### Step 2: Deploy Your Backend

1. **Push your code to GitHub** (make sure sensitive files are gitignored!)
2. **Render will auto-deploy** if connected to GitHub
3. **Or manually deploy** from Render dashboard

### Step 3: Verify Deployment

1. **Check server health:**
   ```
   https://touba-hair-hs-1.onrender.com/api/health
   ```

2. **Test braiders endpoint:**
   ```
   https://touba-hair-hs-1.onrender.com/api/braiders
   ```
   Should return JSON with 25 braiders.

3. **Check server logs** in Render dashboard for any errors

### Step 4: Seed Employees on Render (If Needed)

If employees aren't showing up after deployment:

**Option A: Use Render Shell** (Recommended)
1. Go to Render dashboard → Your service → Shell
2. Run:
   ```bash
   cd server
   node scripts/seedEmployees.js
   ```

**Option B: Create a One-Time Endpoint**
Add this to `server/server.js` temporarily:
```javascript
app.post('/api/admin/seed-employees', async (req, res) => {
  // Run seed script
  // Remove this endpoint after seeding!
});
```

### Step 5: Update Frontend API URL (If Needed)

If your frontend is also on Render or different domain:

1. **Set environment variable** in frontend:
   ```
   VITE_API_URL=https://touba-hair-hs-1.onrender.com
   ```

2. **Or update** `src/utils/api.js`:
   ```javascript
   const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://touba-hair-hs-1.onrender.com';
   ```

## 🔍 Troubleshooting

### Braiders Not Showing After Deployment?

1. **Check API endpoint:**
   - Visit: `https://touba-hair-hs-1.onrender.com/api/braiders`
   - Should return JSON, not an error

2. **Check MongoDB connection:**
   - Look at Render logs for connection errors
   - Verify `MONGODB_URI` is set correctly

3. **Check if employees exist:**
   - Use Render Shell to run: `node server/scripts/checkEmployees.js`
   - Should show 25 employees

4. **Check CORS:**
   - Verify `FRONTEND_URL` in environment variables
   - Check browser console for CORS errors

5. **Check browser console:**
   - Open DevTools (F12) → Console
   - Look for API errors
   - Check Network tab for failed requests

### Server Not Starting?

1. **Check environment variables** are all set
2. **Check server logs** in Render dashboard
3. **Verify MongoDB connection string** is correct
4. **Check if port is set** (Render uses `PORT` env var)

## 📝 Quick Reference

### Local Development:
- ✅ Braiders show up if:
  - Server running locally (`npm start` in server folder)
  - `.env` file has correct `MONGODB_URI`
  - Employees seeded (`node scripts/seedEmployees.js`)
  - Frontend points to `http://localhost:3000`

### Production (Render):
- ✅ Braiders show up if:
  - Render service is deployed and running
  - Environment variables set correctly
  - Employees exist in MongoDB Atlas
  - Frontend calls correct API URL
  - CORS configured properly

## 🎯 Summary

**To see braiders on your live site:**
1. ✅ Deploy backend to Render
2. ✅ Set environment variables on Render
3. ✅ Ensure employees are seeded in MongoDB Atlas
4. ✅ Verify API endpoint works: `/api/braiders`
5. ✅ Check frontend is calling correct API URL

**The database is already in the cloud (MongoDB Atlas), so once your Render server is running with the correct environment variables, the braiders should appear!**

