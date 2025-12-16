# Render Setup - Final Steps

## Your MongoDB Connection String

**Copy this EXACT string:**

```
mongodb+srv://Hvdeem:HXKekoskee6%24HS@toubacluster.enbxk.mongodb.net/touba-hair?retryWrites=true&w=majority
```

**Note:** The `$` in your password is encoded as `%24` (URL encoding)

## Step-by-Step: Add to Render

### 1. Go to Render Dashboard
- Visit: https://dashboard.render.com
- Sign in to your account

### 2. Open Your Service
- Click on: `touba-hair-hs-1` (or your service name)

### 3. Go to Environment Tab
- Click on **"Environment"** tab at the top

### 4. Add/Update MONGODB_URI
- Look for `MONGODB_URI` in the list
- If it exists: Click the edit/pencil icon
- If it doesn't exist: Click **"Add Environment Variable"**

### 5. Set the Value
- **Key:** `MONGODB_URI`
- **Value:** Paste this EXACT string:
  ```
  mongodb+srv://Hvdeem:HXKekoskee6%24HS@toubacluster.enbxk.mongodb.net/touba-hair?retryWrites=true&w=majority
  ```
- **Important:** 
  - No quotes around the value
  - No extra spaces
  - Copy exactly as shown above

### 6. Save
- Click **"Save Changes"**
- Render will automatically redeploy (takes 1-2 minutes)

### 7. Verify Connection
After redeploy completes (check the "Events" tab), test:

**Option A: Check Health Endpoint**
```
https://touba-hair-hs-1.onrender.com/api/health
```
Should show: `"database": "connected"`

**Option B: Check Render Logs**
1. Go to "Logs" tab in Render
2. Look for: `✅ Connected to MongoDB`
3. Should see: `📊 Database: touba-hair`

### 8. Create Admin Account
Once database is connected, create admin account in browser console:

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
.then(data => {
  if (data.user) {
    console.log('✅ Admin created!', data);
    console.log('Now you can login with:');
    console.log('Email: admin@toubahair.com');
    console.log('Password: Admin123!@#');
  } else {
    console.log('Response:', data);
  }
})
.catch(err => console.error('Error:', err));
```

## Troubleshooting

**Still shows "disconnected":**
- Wait 2-3 minutes after saving
- Check Render logs for MongoDB connection errors
- Verify connection string is exactly as shown above
- Make sure MongoDB Atlas IP whitelist includes `0.0.0.0/0`

**Connection timeout:**
- Check MongoDB Atlas → Network Access → IP Whitelist
- Make sure `0.0.0.0/0` is added
- Verify database user `Hvdeem` exists and password is correct

**Authentication failed:**
- Double-check password encoding (`%24` for `$`)
- Verify username is `Hvdeem` (case-sensitive)

## What's Next?

1. ✅ Add connection string to Render
2. ✅ Wait for redeploy
3. ✅ Verify database connects
4. ✅ Create admin account
5. ✅ Login and test!

