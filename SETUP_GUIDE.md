# Touba Hair Salon - Production Setup Guide

## 🎯 What's Been Built

Your hair braiding salon app has been upgraded from a client-side only app to a full-stack production-ready application with:

### ✅ Completed Features

1. **Backend Database & API**
   - MongoDB/Mongoose models for Users, Appointments, and Rewards
   - RESTful API endpoints for authentication, appointments, and rewards
   - JWT-based authentication with secure password hashing
   - Role-based access control (client, employee, admin)

2. **Frontend Integration**
   - Updated auth system to use backend API
   - BookAppointment now saves to database
   - MyBookings fetches from backend API
   - Token-based authentication with localStorage

3. **Security Features**
   - Password hashing with bcrypt
   - JWT tokens for session management
   - Rate limiting on auth routes
   - Input validation with express-validator
   - CORS configuration

4. **Rewards System**
   - Points tracking per client
   - Automatic points on appointment completion
   - Points redemption functionality
   - Tier system (bronze, silver, gold, platinum)

## 📋 Setup Instructions

### Step 1: Install Backend Dependencies

```bash
cd server
npm install
```

This will install:
- mongoose (MongoDB)
- bcryptjs (password hashing)
- jsonwebtoken (JWT)
- express-rate-limit (rate limiting)
- express-validator (input validation)

### Step 2: Set Up MongoDB

**Option A: MongoDB Atlas (Recommended for Production)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Add it to your `.env` file

**Option B: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/touba-hair`

### Step 3: Configure Environment Variables

Create `server/.env` file:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/touba-hair
# OR for local: mongodb://localhost:27017/touba-hair

# JWT Secret (CHANGE THIS!)
# Generate a strong random string: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL (for CORS)
FRONTEND_URL=https://hadeems.github.io
# OR for local dev: http://localhost:5173

# Server Port
PORT=3000
```

### Step 4: Start Backend Server

```bash
cd server
npm start
# OR for development with auto-reload:
npm run dev
```

The server should start on `http://localhost:3000`

### Step 5: Update Frontend Environment

Create `.env` file in root directory:

```env
VITE_API_URL=http://localhost:3000
# OR for production:
# VITE_API_URL=https://your-render-backend-url.onrender.com
```

### Step 6: Deploy Backend to Render

1. Push your code to GitHub
2. Go to https://render.com
3. Create a new Web Service
4. Connect your GitHub repo
5. Set:
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Environment Variables**: Add all from your `.env` file

### Step 7: Create Initial Admin/Employee Accounts

You'll need to create employee accounts. You can do this via:

**Option A: Using the API directly**
```bash
curl -X POST https://your-api-url.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@toubahair.com",
    "password": "secure-password-here",
    "role": "admin"
  }'
```

**Option B: Create a simple script** (see `server/scripts/createAdmin.js`)

## 🔐 Security Considerations

### ✅ Implemented
- Password hashing (bcrypt)
- JWT tokens
- Rate limiting on auth routes
- Input validation
- CORS protection

### ⚠️ Important Security Notes

1. **JWT Secret**: Change `JWT_SECRET` in production! Use a strong random string.
2. **MongoDB**: Never commit your MongoDB connection string. Use environment variables.
3. **HTTPS**: Always use HTTPS in production (Render provides this automatically).
4. **Password Policy**: Consider adding password strength requirements.
5. **Token Expiry**: Currently set to 7 days. Consider shorter expiry for production.

## 📊 Database Schema

### Users Collection
- `name`, `email`, `phone`, `password` (hashed)
- `role`: 'client', 'employee', 'admin'
- `braiderId`: Links employee to braider profile
- `isActive`: Account status

### Appointments Collection
- `clientId`, `employeeId`: References to Users
- `braiderId`, `braiderName`: Braider info
- `date`, `timeSlot`, `dateTime`: Scheduling info
- `status`: 'pending', 'confirmed', 'completed', 'cancelled', 'no-show'
- `serviceName`, `servicePrice`: Service details

### Rewards Collection
- `clientId`: Reference to User
- `totalPoints`, `lifetimePoints`, `pointsRedeemed`
- `tier`: 'bronze', 'silver', 'gold', 'platinum'

## 🚀 Next Steps

### Immediate (Required)
1. ✅ Set up MongoDB (Atlas or local)
2. ✅ Configure `.env` files
3. ✅ Deploy backend to Render
4. ✅ Create admin/employee accounts

### Short Term (Recommended)
1. Create employee dashboard for managing appointments
2. Add rewards display to client profile
3. Add professional pages (Policies, FAQs, Contact, About)
4. Improve error handling and user feedback
5. Add loading states and better UX

### Long Term (Enhancements)
1. Email notifications (beyond Web3Forms)
2. SMS reminders
3. Payment integration
4. Calendar sync
5. Client reviews/ratings
6. Analytics dashboard

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Verify all dependencies installed (`npm install`)
- Check port isn't already in use

### Frontend can't connect to backend
- Verify `VITE_API_URL` is correct
- Check CORS settings in backend
- Ensure backend is running

### Authentication not working
- Check JWT_SECRET is set
- Verify token is being stored in localStorage
- Check browser console for errors

### Database connection issues
- Verify MongoDB URI is correct
- Check network/firewall settings
- For Atlas: Whitelist your IP address

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Appointments
- `GET /api/appointments` - Get all appointments (filtered by role)
- `GET /api/appointments/:id` - Get single appointment
- `POST /api/appointments` - Create appointment
- `PATCH /api/appointments/:id/status` - Update status (employee/admin)
- `DELETE /api/appointments/:id` - Cancel appointment

### Rewards
- `GET /api/rewards/me` - Get client's rewards
- `GET /api/rewards/client/:clientId` - Get client rewards (employee/admin)
- `POST /api/rewards/adjust` - Adjust points (employee/admin)
- `POST /api/rewards/redeem` - Redeem points (client)

## 💡 Tips

1. **Testing**: Use Postman or curl to test API endpoints
2. **Monitoring**: Render provides logs and monitoring
3. **Backups**: MongoDB Atlas provides automatic backups
4. **Scaling**: Render auto-scales, but monitor usage

## 📞 Support

If you encounter issues:
1. Check server logs (Render dashboard)
2. Check browser console for frontend errors
3. Verify environment variables are set correctly
4. Test API endpoints directly with Postman

---

**Ready to go live!** 🎉

