# Admin Account Credentials

## Your Admin Account

**Email:** `admin@toubahair.com`  
**Password:** `Admin123!@#`

## ⚠️ If Login Says "Wrong Credentials"

**The admin account might not exist in your database yet!** You need to create it first.

### Quick Fix: Create Admin Account (Browser Method)

1. Go to your website: https://hadeems.github.io/Touba-Hair_HS
2. Press `F12` to open Developer Tools
3. Click the **Console** tab
4. Copy and paste this code, then press Enter:

```javascript
fetch('https://touba-hair-hs-1.onrender.com/api/auth/create-demo-users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
})
.then(res => res.json())
.then(data => {
  console.log('✅ Success!', data);
  alert('Admin account created! You can now log in with:\nEmail: admin@toubahair.com\nPassword: Admin123!@#');
})
.catch(err => {
  console.error('❌ Error:', err);
  alert('Error: ' + err.message);
});
```

5. Wait for the success message
6. Go to the login page and use the credentials above

### Alternative: Using Command Line

```bash
curl -X POST https://touba-hair-hs-1.onrender.com/api/auth/create-demo-users -H "Content-Type: application/json"
```

## How to Access (After Creating Account)

1. Go to your site: https://hadeems.github.io/Touba-Hair_HS/login
2. Enter the credentials above
3. You'll be automatically redirected to the Admin Dashboard

## Admin Dashboard Features

- **View All Appointments** - See all bookings across all braiders
- **Filter by Status** - Filter by upcoming, completed, cancelled, or pending
- **Filter by Date** - View appointments for specific dates
- **Update Status** - Mark appointments as completed or cancel them
- **Statistics** - View total, upcoming, completed, and cancelled appointment counts

## Security Notes

⚠️ **IMPORTANT:** 
- Change your password after first login
- Keep these credentials secure
- Don't share admin access with unauthorized users

## Changing Your Password

Currently, password changes need to be done via the API or database. Future updates will include a password change feature in the admin dashboard.

## Creating Additional Admin Accounts

You can create more admin accounts via the API:

```bash
curl -X POST https://touba-hair-hs-1.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Another Admin",
    "email": "admin2@toubahair.com",
    "password": "SecurePassword123!",
    "role": "admin"
  }'
```

---

**Keep this file secure and don't commit it to public repositories!**

