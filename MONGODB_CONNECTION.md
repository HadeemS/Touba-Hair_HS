# Your MongoDB Connection String

## Current Connection String
```
mongodb+srv://Hvdeem:<db_password>@toubacluster.enbxk.mongodb.net/?appName=ToubaCluster
```

## Steps to Complete Setup

### Step 1: Complete the Connection String

Replace `<db_password>` with your actual MongoDB database password, and add the database name:

**Format:**
```
mongodb+srv://Hvdeem:YOUR_PASSWORD@toubacluster.enbxk.mongodb.net/touba-hair?retryWrites=true&w=majority
```

**Important:**
- Replace `YOUR_PASSWORD` with your actual MongoDB password
- Add `/touba-hair` before the `?` (this is your database name)
- Keep `?retryWrites=true&w=majority` at the end

**Example (if your password is "MyPass123"):**
```
mongodb+srv://Hvdeem:MyPass123@toubacluster.enbxk.mongodb.net/touba-hair?retryWrites=true&w=majority
```

### Step 2: Add to Render

1. Go to: https://dashboard.render.com
2. Click your service: `touba-hair-hs-1`
3. Go to **"Environment"** tab
4. Click **"Add Environment Variable"**
5. Add:
   - **Key:** `MONGODB_URI`
   - **Value:** Your complete connection string (from Step 1)
6. Click **"Save Changes"**
7. Render will automatically redeploy (takes 1-2 minutes)

### Step 3: Verify Connection

After Render redeploys, check the health endpoint:

```
https://touba-hair-hs-1.onrender.com/api/health
```

Should show: `"database": "connected"`

### Step 4: Create Admin Account

Once connected, create your admin account in browser console:

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
  } else {
    console.log('Response:', data);
  }
})
.catch(err => console.error('Error:', err));
```

## Important Notes

⚠️ **Password Encoding:**
- If your password has special characters (`@`, `#`, `!`, etc.), they need to be URL-encoded
- `@` becomes `%40`
- `#` becomes `%23`
- `!` becomes `%21`
- `$` becomes `%24`

**Example:**
If password is `MyPass@123#`, the encoded version is `MyPass%40123%23`

**Or use this tool:** https://www.urlencoder.org/

## Troubleshooting

**Still shows "disconnected":**
- Wait 2-3 minutes after adding environment variable
- Check Render logs for errors
- Verify connection string format is correct
- Make sure database name `/touba-hair` is included

**Connection errors:**
- Verify IP whitelist in MongoDB Atlas includes `0.0.0.0/0`
- Check username and password are correct
- Make sure special characters in password are URL-encoded

