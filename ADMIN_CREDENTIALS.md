# Admin Account Credentials

## Your Admin Account

**Email:** `admin@toubahair.com`  
**Password:** `Admin123!@#`

## How to Access

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

