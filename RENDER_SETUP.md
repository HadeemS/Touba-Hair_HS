# Render Deployment Setup

## Quick Answer: Root Directory

**YES, you need to set the root directory to `server` in Render.**

## Render Dashboard Configuration

When creating/editing your web service on Render:

### 1. **Root Directory**
Set to: `server`

This tells Render where your server code is located.

### 2. **Build Command**
```
npm install
```

### 3. **Start Command**
```
npm start
```

This runs `node server.js` (as defined in `server/package.json`).

## Environment Variables

Set these in Render Dashboard → Environment:

1. **MONGODB_URI**
   - Your full MongoDB Atlas connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/touba-hair?retryWrites=true&w=majority`

2. **JWT_SECRET**
   - Generate a strong random string:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   - Or use: `openssl rand -hex 32`

3. **FRONTEND_URL**
   - Set to: `https://hadeems.github.io`
   - Or comma-separated: `https://hadeems.github.io,https://hadeems.github.io/Touba-Hair_HS`

4. **NODE_ENV**
   - Set to: `production`

## Alternative: Using render.yaml

I've created a `render.yaml` file in the root directory. If you use this:

1. Connect your GitHub repo to Render
2. Render will automatically detect `render.yaml`
3. It will use `rootDir: server` automatically
4. You still need to set `MONGODB_URI` and `JWT_SECRET` in the dashboard

## Step-by-Step Render Setup

1. **Go to Render Dashboard** → New → Web Service
2. **Connect your GitHub repository**
3. **Configure:**
   - **Name**: `touba-hair-api` (or any name)
   - **Root Directory**: `server` ⚠️ **IMPORTANT**
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. **Add Environment Variables:**
   - `MONGODB_URI` = your MongoDB connection string
   - `JWT_SECRET` = generated secret (32+ characters)
   - `FRONTEND_URL` = `https://hadeems.github.io`
   - `NODE_ENV` = `production`
5. **Click "Create Web Service"**
6. **Wait for deployment** (first deploy takes 2-3 minutes)

## Verify Deployment

After deployment, test:

```bash
# Health check
curl https://your-service.onrender.com/api/health

# Test database
curl https://your-service.onrender.com/api/test-db
```

Both should return JSON with `status: "ok"` and `database.isConnected: true`.

## Common Issues

### Issue: "Cannot find module"
**Solution:** Make sure Root Directory is set to `server`, not root.

### Issue: "Port not found"
**Solution:** Render automatically sets PORT. Don't override it.

### Issue: "MongoDB connection failed"
**Solution:** 
- Check MONGODB_URI is set correctly
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Wait 30-60 seconds after first deploy (Render spins up)

### Issue: "JWT_SECRET must be set"
**Solution:** Generate and set JWT_SECRET in environment variables.

## Summary

✅ **Root Directory**: `server`  
✅ **Build Command**: `npm install`  
✅ **Start Command**: `npm start`  
✅ **Environment Variables**: MONGODB_URI, JWT_SECRET, FRONTEND_URL, NODE_ENV

