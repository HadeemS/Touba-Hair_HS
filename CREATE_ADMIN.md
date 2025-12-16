# Creating Admin Account - Troubleshooting Guide

## Issue: Login Failing

If you're getting "failed to log in" errors, follow these steps:

### Step 1: Verify Admin Account Exists

The admin account might not have been created. Let's create it manually:

**Option A: Using Browser Console**

1. Open your site: https://hadeems.github.io/Touba-Hair_HS
2. Open browser console (F12)
3. Run this code:

```javascript
fetch('https://touba-hair-hs-1.onrender.com/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Admin User',
    email: 'admin@toubahair.com',
    password: 'Admin123!@#',
    role: 'admin'
  })
})
.then(res => res.json())
.then(data => {
  if (data.error && data.error.includes('already exists')) {
    console.log('✅ Admin account already exists!')
  } else if (data.user) {
    console.log('✅ Admin account created!', data)
  } else {
    console.error('❌ Error:', data)
  }
})
.catch(err => console.error('❌ Network error:', err))
```

**Option B: Using Postman or Similar Tool**

1. POST to: `https://touba-hair-hs-1.onrender.com/api/auth/register`
2. Headers: `Content-Type: application/json`
3. Body:
```json
{
  "name": "Admin User",
  "email": "admin@toubahair.com",
  "password": "Admin123!@#",
  "role": "admin"
}
```

### Step 2: Test Login

After creating the account, test login:

```javascript
fetch('https://touba-hair-hs-1.onrender.com/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@toubahair.com',
    password: 'Admin123!@#'
  })
})
.then(res => res.json())
.then(data => {
  if (data.token) {
    console.log('✅ Login successful!', data)
    localStorage.setItem('auth_token', data.token)
    localStorage.setItem('touba_hair_auth', JSON.stringify({
      ...data.user,
      loggedIn: true
    }))
    console.log('✅ Token saved! Refresh the page.')
  } else {
    console.error('❌ Login failed:', data)
  }
})
.catch(err => console.error('❌ Error:', err))
```

### Step 3: Common Issues

**Rate Limiting:**
- If you see "Too many login attempts", wait 15 minutes
- The rate limit has been increased to 20 attempts per 15 minutes

**Account Doesn't Exist:**
- Run the registration code above
- Check MongoDB to verify the user was created

**Network Errors:**
- Check if backend is running: https://touba-hair-hs-1.onrender.com/api/health
- Check browser console for CORS errors
- Verify API URL in `src/utils/api.js`

**Wrong Password:**
- Make sure password is exactly: `Admin123!@#`
- Check for extra spaces or typos

### Step 4: Manual Token Test

If login works but frontend doesn't, manually set the token:

```javascript
// In browser console
localStorage.setItem('auth_token', 'YOUR_TOKEN_HERE')
localStorage.setItem('touba_hair_auth', JSON.stringify({
  id: 'USER_ID',
  name: 'Admin User',
  email: 'admin@toubahair.com',
  role: 'admin',
  loggedIn: true
}))
// Then refresh the page
```

## Admin Credentials

**Email:** `admin@toubahair.com`  
**Password:** `Admin123!@#`

## Next Steps

1. Create the admin account using one of the methods above
2. Test login
3. If it works, try logging in through the frontend
4. Check browser console for any errors

