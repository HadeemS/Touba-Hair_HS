# How to Create Your Admin Account

## Admin Credentials

**Email:** `admin@toubahair.com`  
**Password:** `Admin123!@#`

## If Login Says "Wrong Credentials"

The admin account might not exist in your database yet. Here's how to create it:

## Method 1: Create Admin Account via API (Easiest)

### Option A: Using Browser (Easiest)
1. Make sure your server is online (visit `https://touba-hair-hs-1.onrender.com/api/health`)
2. Open your browser and go to this URL:
   ```
   https://touba-hair-hs-1.onrender.com/api/auth/create-demo-users
   ```
   But wait - this is a POST endpoint, so you need to use a tool.

### Option B: Using curl (Command Line)
Open your terminal/command prompt and run:
```bash
curl -X POST https://touba-hair-hs-1.onrender.com/api/auth/create-demo-users \
  -H "Content-Type: application/json"
```

This will create:
- Admin account: `admin@toubahair.com` / `Admin123!@#`
- Employee accounts: `mariama@toubahair.com`, `amina@toubahair.com`, etc.
- Test client: `customer1@example.com` / `Customer123!`

### Option C: Create Just Admin Account
```bash
curl -X POST https://touba-hair-hs-1.onrender.com/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@toubahair.com",
    "password": "Admin123!@#"
  }'
```

## Method 2: Using Browser Developer Tools

1. Go to your website: `https://hadeems.github.io/Touba-Hair_HS`
2. Press `F12` to open Developer Tools
3. Go to the **Console** tab
4. Paste this code and press Enter:

```javascript
fetch('https://touba-hair-hs-1.onrender.com/api/auth/create-demo-users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => {
  console.log('✅ Success!', data);
  alert('Admin account created! You can now log in.');
})
.catch(err => {
  console.error('❌ Error:', err);
  alert('Error creating account. Check console for details.');
});
```

## Method 3: Using Postman or Similar Tool

1. Download [Postman](https://www.postman.com/downloads/) (free)
2. Create a new POST request
3. URL: `https://touba-hair-hs-1.onrender.com/api/auth/create-demo-users`
4. Headers: `Content-Type: application/json`
5. Click "Send"
6. You should see a success message

## After Creating the Account

1. Go to your login page: `https://hadeems.github.io/Touba-Hair_HS/login`
2. Enter:
   - **Email:** `admin@toubahair.com`
   - **Password:** `Admin123!@#`
3. Click "Sign In"
4. You should be redirected to the Admin Dashboard

## Troubleshooting

### "Cannot connect to server"
- Your Render service might be sleeping
- Visit `https://touba-hair-hs-1.onrender.com/api/health` to wake it up
- Wait 30-60 seconds, then try again

### "Database not connected"
- Check your `MONGODB_URI` environment variable in Render dashboard
- Make sure MongoDB Atlas IP whitelist includes `0.0.0.0/0`

### "User already exists"
- The account already exists! Try logging in with the credentials above
- If password doesn't work, the account might have a different password

### Still Having Issues?
1. Check Render logs for errors
2. Verify MongoDB connection is working
3. Try creating the account again (it will update if it exists)

## All Demo Accounts Created

After running `/api/auth/create-demo-users`, you'll have:

**Admin:**
- Email: `admin@toubahair.com`
- Password: `Admin123!@#`

**Employees (Braiders):**
- Email: `mariama@toubahair.com` | Password: `Employee123!`
- Email: `amina@toubahair.com` | Password: `Employee123!`
- Email: `fatou@toubahair.com` | Password: `Employee123!`
- Email: `aissatou@toubahair.com` | Password: `Employee123!`

**Test Client:**
- Email: `customer1@example.com` | Password: `Customer123!`


