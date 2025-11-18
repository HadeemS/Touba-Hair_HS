# MongoDB Setup Guide

## Quick Setup Steps

### 1. Create MongoDB Atlas Account
- Go to: https://www.mongodb.com/cloud/atlas
- Sign up for free account
- No credit card required for free tier

### 2. Create Free Cluster
- Click "Build a Database"
- Choose **M0 FREE** (Free Shared)
- Choose AWS as provider
- Choose region closest to you
- Name: `Cluster0` (or any name)
- Click "Create" (takes 3-5 minutes)

### 3. Create Database User
- Username: `touba-admin` (or your choice)
- Password: **Save this password!** You'll need it
- Click "Create User"

### 4. Whitelist IP Addresses
- Go to "Network Access"
- Click "Add IP Address"
- Click "Allow Access from Anywhere" (adds `0.0.0.0/0`)
- Click "Confirm"

### 5. Get Connection String
- Click "Connect" on your cluster
- Choose "Connect your application"
- Copy the connection string
- It looks like:
  ```
  mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
  ```
- Replace `<username>` with your database username
- Replace `<password>` with your database password
- Add database name: Change `?retryWrites` to `/touba-hair?retryWrites`
- Final format:
  ```
  mongodb+srv://touba-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/touba-hair?retryWrites=true&w=majority
  ```

### 6. Add to Render
1. Go to: https://dashboard.render.com
2. Click your service: `touba-hair-hs-1`
3. Go to "Environment" tab
4. Click "Add Environment Variable"
5. Add:
   - **Key:** `MONGODB_URI`
   - **Value:** Your full connection string from step 5
6. Click "Save Changes"
7. Wait for auto-redeploy (1-2 minutes)

### 7. Verify Connection
After redeploy, check:
```
https://touba-hair-hs-1.onrender.com/api/health
```

Should show: `"database": "connected"`

### 8. Create Admin Account
Once database is connected, create admin account using browser console:

```javascript
fetch('https://touba-hair-hs-1.onrender.com/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Admin User',
    email: 'admin@toubahair.com',
    password: 'Admin123!@#',
    role: 'admin'
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err))
```

## Troubleshooting

**Connection String Issues:**
- Make sure username and password are URL-encoded (replace special chars)
- Make sure database name is included: `/touba-hair?`
- No spaces in connection string

**IP Whitelist:**
- Must add `0.0.0.0/0` to allow Render's IPs
- Or add Render's specific IP addresses

**Render Environment Variable:**
- Key must be exactly: `MONGODB_URI`
- Value must be the full connection string
- No quotes needed in Render's environment variable value

**Still Disconnected:**
- Wait 2-3 minutes after adding environment variable
- Check Render logs for connection errors
- Verify connection string format is correct

## Free Tier Limits

- **512 MB storage** - Plenty for starting out
- **Shared RAM/CPU** - Fine for small apps
- **No credit card required**
- Can upgrade later if needed

## Security Notes

- Keep your database password secure
- Don't commit connection strings to Git
- Use environment variables (which you're doing!)
- Consider rotating passwords periodically

