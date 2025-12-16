# Fix Login Issues - Quick Guide

## Problem
Demo logins not working - users may not exist or passwords were reset.

## Solution 1: Create All Demo Users (Recommended)

**Call this endpoint to create/reset all demo accounts:**

```bash
curl -X POST https://your-render-url.onrender.com/api/auth/create-demo-users
```

Or from browser console:
```javascript
fetch('https://your-render-url.onrender.com/api/auth/create-demo-users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
})
.then(r => r.json())
.then(console.log)
```

This will:
- Create all demo users if they don't exist
- Reset passwords for existing users
- Return a summary of what was created/updated

## Solution 2: Create Individual Admin

```bash
curl -X POST https://your-render-url.onrender.com/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@toubahair.com","password":"Admin123!@#"}'
```

## Demo Accounts Created

After running `/api/auth/create-demo-users`, these accounts will be available:

### Admin
- **Email**: `admin@toubahair.com`
- **Password**: `Admin123!@#`
- **Role**: Admin (full access)

### Employees
- **Email**: `mariama@toubahair.com`
- **Password**: `Employee123!`
- **Role**: Employee (braiderId: 3)

- **Email**: `amina@toubahair.com`
- **Password**: `Employee123!`
- **Role**: Employee (braiderId: 1)

- **Email**: `fatou@toubahair.com`
- **Password**: `Employee123!`
- **Role**: Employee (braiderId: 2)

- **Email**: `aissatou@toubahair.com`
- **Password**: `Employee123!`
- **Role**: Employee (braiderId: 4)

### Client
- **Email**: `customer1@example.com`
- **Password**: `Customer123!`
- **Role**: Client

## Troubleshooting

### If endpoint returns "Database not connected"
1. Check MongoDB connection string in Render
2. Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
3. Wait 30-60 seconds after Render service starts

### If login still fails after creating users
1. Check server logs on Render for `[LOGIN]` entries
2. Verify the email is exactly as shown (case-insensitive but check spelling)
3. Verify password matches exactly (case-sensitive)
4. Check that `isActive` is `true` in database

### Check if users exist
```bash
# From server logs, look for:
[LOGIN] User found: admin@toubahair.com, Role: admin, HasPassword: true
```

### Reset a specific user's password
Use the create-admin endpoint with that user's email:
```bash
curl -X POST https://your-render-url.onrender.com/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{"name":"Mariama","email":"mariama@toubahair.com","password":"Employee123!"}'
```

## Next Steps

1. **Call `/api/auth/create-demo-users`** to create/reset all accounts
2. **Try logging in** with demo credentials
3. **Check server logs** if login still fails
4. **Verify MongoDB connection** using `/api/test-db`

