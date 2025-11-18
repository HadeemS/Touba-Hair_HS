# 🔐 Demo Login Credentials

This document contains all demo/test accounts for the Touba Hair Salon application.

---

## 👑 Admin Account

**Role:** Admin (Full Access)  
**Email:** `admin@toubahair.com`  
**Password:** `Admin123!@#`

**Access:**
- ✅ Admin Dashboard (`/admin`)
- ✅ View all appointments
- ✅ Manage all appointments
- ✅ Update appointment statuses
- ✅ View statistics
- ✅ Change email and password

**Redirects to:** `/admin` (Admin Dashboard)

---

## 👨‍💼 Employee/Braider Accounts

**All employee accounts are now created and ready to use!**

### Available Employee Accounts:

1. **Amina** (Braider ID: 1)
   - **Email:** `amina@toubahair.com`
   - **Password:** `Employee123!`
   - **Braider ID:** `1`

2. **Fatou** (Braider ID: 2)
   - **Email:** `fatou@toubahair.com`
   - **Password:** `Employee123!`
   - **Braider ID:** `2`

3. **Mariama** (Braider ID: 3) ✅ **Confirmed Created**
   - **Email:** `mariama@toubahair.com`
   - **Password:** `Employee123!`
   - **Braider ID:** `3`

4. **Aissatou** (Braider ID: 4)
   - **Email:** `aissatou@toubahair.com`
   - **Password:** `Employee123!`
   - **Braider ID:** `4`

**Access:**
- ✅ Braider Dashboard (`/braider-profile`)
- ✅ View assigned appointments
- ✅ Mark appointments as completed
- ✅ Cancel appointments
- ✅ Change email and password

**Redirects to:** `/braider-profile` (Braider Dashboard)

---

## 👤 Client/Customer Accounts

**All client accounts are now created and ready to use!**

### Available Client Accounts:

1. **Test Customer 1** ✅ **Confirmed Created**
   - **Email:** `customer1@example.com`
   - **Password:** `Customer123!`

2. **Test Customer 2** ✅ **Confirmed Created**
   - **Email:** `customer2@example.com`
   - **Password:** `Customer123!`

3. **Sarah Johnson** ✅ **Confirmed Created**
   - **Email:** `sarah@example.com`
   - **Password:** `Customer123!`

**Access:**
- ✅ Book appointments (`/book-appointment`)
- ✅ View bookings (`/my-bookings`)
- ✅ View profile (`/profile`)
- ✅ View rewards points
- ✅ Change email and password

**Redirects to:** `/my-bookings` (My Bookings page)

---

## 🎯 Quick Reference

| Role | Email | Password | Dashboard | Status |
|------|-------|----------|-----------|--------|
| **Admin** | `admin@toubahair.com` | `Admin123!@#` | `/admin` | ✅ Ready |
| **Employee (Amina)** | `amina@toubahair.com` | `Employee123!` | `/braider-profile` | ✅ Ready |
| **Employee (Fatou)** | `fatou@toubahair.com` | `Employee123!` | `/braider-profile` | ✅ Ready |
| **Employee (Mariama)** | `mariama@toubahair.com` | `Employee123!` | `/braider-profile` | ✅ Ready |
| **Employee (Aissatou)** | `aissatou@toubahair.com` | `Employee123!` | `/braider-profile` | ✅ Ready |
| **Client 1** | `customer1@example.com` | `Customer123!` | `/my-bookings` | ✅ Ready |
| **Client 2** | `customer2@example.com` | `Customer123!` | `/my-bookings` | ✅ Ready |
| **Client 3 (Sarah)** | `sarah@example.com` | `Customer123!` | `/my-bookings` | ✅ Ready |

---

## 📝 Creating Additional Accounts

### Create Admin Account:
```bash
curl -X POST https://touba-hair-hs-1.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Admin",
    "email": "admin2@toubahair.com",
    "password": "SecurePassword123!",
    "role": "admin"
  }'
```

### Create Employee Account:
```bash
curl -X POST https://touba-hair-hs-1.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Employee Name",
    "email": "employee@toubahair.com",
    "password": "Employee123!",
    "role": "employee",
    "braiderId": "1"
  }'
```

### Create Client Account:
```bash
curl -X POST https://touba-hair-hs-1.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Customer Name",
    "email": "customer@example.com",
    "password": "Customer123!",
    "role": "client"
  }'
```

---

## 🔒 Security Notes

⚠️ **IMPORTANT:**
- These are demo credentials - change passwords in production!
- Admin password should be changed immediately after first login
- Use strong passwords for production accounts
- Don't commit this file to public repositories

---

## 🧪 Testing Different Roles

1. **Test Admin Features:**
   - Login as `admin@toubahair.com`
   - Access Admin Dashboard
   - View all appointments
   - Update appointment statuses

2. **Test Employee Features:**
   - Create an employee account
   - Login as employee
   - Access Braider Dashboard
   - View assigned appointments
   - Mark appointments as completed

3. **Test Client Features:**
   - Create a client account
   - Login as client
   - Book an appointment
   - View bookings
   - Check rewards points

---

## 📍 Login Page

The login page (`/login`) displays the admin credentials for quick access.

**URL:** https://hadeems.github.io/Touba-Hair_HS/login

---

## 🔄 Changing Passwords

All users (including admins) can change their passwords:
1. Login to your account
2. Go to Profile page (`/profile`)
3. Click "Change Password"
4. Enter current password (if you have one)
5. Enter new password
6. Confirm new password
7. Click "Change Password"

---

**Last Updated:** Current as of latest deployment

