# Debug Login Issues

## Step 1: Check Database Connection

Test if MongoDB is connected:
```bash
curl https://touba-hair-hs-1.onrender.com/api/health
```

Should show: `"database": "connected"`

If it shows `"disconnected"`, MongoDB isn't connected. Check:
- MONGODB_URI is set in Render
- Connection string format is correct
- IP whitelist includes 0.0.0.0/0

## Step 2: Create Admin Account

Run this in browser console (F12) on your site:

```javascript
// Create admin account
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
  console.log('Response:', data);
  if (data.user) {
    console.log('✅ Admin account created!');
    console.log('User:', data.user);
    console.log('Token:', data.token);
  } else if (data.error && data.error.includes('already exists')) {
    console.log('✅ Admin account already exists!');
    console.log('Try logging in now.');
  } else {
    console.error('❌ Error:', data);
  }
})
.catch(err => {
  console.error('❌ Network error:', err);
});
```

## Step 3: Test Login Directly

Test login with API:

```javascript
// Test login
fetch('https://touba-hair-hs-1.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@toubahair.com',
    password: 'Admin123!@#'
  })
})
.then(res => res.json())
.then(data => {
  console.log('Login response:', data);
  if (data.token) {
    console.log('✅ Login successful!');
    console.log('Token:', data.token);
    console.log('User:', data.user);
  } else {
    console.error('❌ Login failed:', data);
  }
})
.catch(err => {
  console.error('❌ Error:', err);
});
```

## Step 4: Check Browser Console

When you try to login on the site, check browser console (F12) for:
- Network errors
- API response errors
- CORS errors
- Any red error messages

## Common Issues

**"Invalid email or password":**
- Account doesn't exist → Create it first
- Wrong password → Double-check password
- Database not connected → Check MongoDB connection

**"Too many login attempts":**
- Wait 15 minutes
- Rate limit has been increased to 20 attempts

**Network errors:**
- Check if backend is running
- Check CORS settings
- Verify API URL is correct

## Quick Fix: Manual Token Test

If login works via API but not frontend, manually set token:

```javascript
// Get token from API login first, then:
localStorage.setItem('auth_token', 'YOUR_TOKEN_HERE');
localStorage.setItem('touba_hair_auth', JSON.stringify({
  id: 'USER_ID',
  name: 'Admin User',
  email: 'admin@toubahair.com',
  role: 'admin',
  loggedIn: true
}));
// Then refresh page
```

