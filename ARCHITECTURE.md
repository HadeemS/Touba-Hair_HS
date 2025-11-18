# Architecture Overview

## System Architecture

```
┌─────────────────┐
│   React Frontend │  (GitHub Pages)
│   (Vite + React) │
└────────┬────────┘
         │ HTTPS
         │ API Calls
         ▼
┌─────────────────┐
│  Express Backend │  (Render)
│   (Node.js)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    MongoDB      │  (Atlas or Local)
│   Database      │
└─────────────────┘
```

## Frontend Structure

```
src/
├── pages/
│   ├── Home.jsx              # Landing page
│   ├── BookAppointment.jsx    # Client booking flow
│   ├── MyBookings.jsx          # Client bookings view
│   ├── Profile.jsx             # User profile
│   ├── Login.jsx               # Authentication
│   ├── Services.jsx            # Services listing
│   ├── Gallery.jsx             # Photo gallery
│   ├── Locations.jsx           # Location info
│   ├── BraiderProfile.jsx      # Employee view (needs update)
│   └── BraiderSettings.jsx     # Employee settings (needs update)
├── components/
│   ├── Navbar.jsx              # Navigation
│   ├── Footer.jsx              # Footer
│   └── ProtectedRoute.jsx      # Route protection
└── utils/
    ├── api.js                  # API client functions
    ├── auth.js                 # Auth utilities
    ├── bookingStorage.js       # Legacy localStorage (fallback)
    └── timeSlots.js            # Time slot utilities
```

## Backend Structure

```
server/
├── models/
│   ├── User.js                # User schema
│   ├── Appointment.js          # Appointment schema
│   └── Reward.js              # Reward schema
├── routes/
│   ├── auth.js                # Auth endpoints
│   ├── appointments.js        # Appointment endpoints
│   └── rewards.js            # Reward endpoints
├── middleware/
│   ├── auth.js                # JWT authentication
│   └── validation.js         # Input validation
└── server.js                  # Main server file
```

## Data Flow

### Authentication Flow
1. User submits login form
2. Frontend calls `POST /api/auth/login`
3. Backend validates credentials
4. Backend returns JWT token
5. Frontend stores token in localStorage
6. Token included in all subsequent requests

### Booking Flow
1. Client selects braider, date, time
2. Frontend calls `POST /api/appointments`
3. Backend validates and saves to MongoDB
4. Backend returns appointment object
5. Frontend updates UI
6. Email sent via Web3Forms (optional)

### Rewards Flow
1. Employee marks appointment as completed
2. Backend calculates points (1 point = $1)
3. Backend updates Reward document
4. Client can view points in Profile/MyBookings
5. Client can redeem points (future feature)

## Security Layers

1. **Authentication**: JWT tokens, password hashing
2. **Authorization**: Role-based access control
3. **Rate Limiting**: Prevents brute force attacks
4. **Input Validation**: Prevents injection attacks
5. **CORS**: Restricts cross-origin requests

## Deployment

### Frontend (GitHub Pages)
- Build: `npm run build`
- Deploy: `npm run deploy` (uses gh-pages)
- URL: `https://hadeems.github.io/Touba-Hair_HS`

### Backend (Render)
- Auto-deploys from GitHub
- Environment variables from Render dashboard
- MongoDB connection via environment variable
- URL: `https://your-app.onrender.com`

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=https://your-backend.onrender.com
```

### Backend (server/.env)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
FRONTEND_URL=https://hadeems.github.io
PORT=3000
```

## Database Relationships

```
User (1) ──< (Many) Appointments (clientId)
User (1) ──< (Many) Appointments (employeeId)
User (1) ──< (1) Reward (clientId)
```

## API Response Formats

### Success Response
```json
{
  "message": "Success message",
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message",
  "errors": [ ... ] // For validation errors
}
```

## Future Enhancements

1. **Real-time Updates**: WebSocket for live appointment updates
2. **File Uploads**: Profile pictures, service images
3. **Notifications**: Push notifications for appointments
4. **Analytics**: Dashboard for business insights
5. **Mobile App**: React Native version

