# Touba Hair Salon - Booking Website

A modern, beautiful hair braiding salon booking website built with React.js, featuring a custom pink and white design theme.

## ✨ Features

- **Stylist Selection**: Choose from expert braiders with detailed profiles
- **Date & Time Booking**: Select available dates and time slots
- **Availability Management**: Real-time availability checking
- **Booking Management**: View and manage your appointments
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI/UX**: Custom pink and white theme with smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Touba-Hair_HS
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## 📁 Project Structure

```
Touba-Hair_HS/
├── src/
│   ├── components/      # Reusable components (Navbar, Footer)
│   ├── pages/          # Page components (Home, BookAppointment, MyBookings)
│   ├── utils/          # Utility functions (booking storage, time slots)
│   ├── data/           # Data files (braiders)
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point
├── public/             # Static assets
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies
```

## 🎨 Customization

### Updating Braiders

Edit `src/data/braiders.js` to add, remove, or modify braider profiles.

### Changing Colors

The color scheme is defined in `src/index.css` under `:root` variables. Modify these to change the theme:

```css
--primary-pink: #ff6b9d;
--secondary-pink: #ffb3d1;
--light-pink: #ffe5f0;
```

### Modifying Time Slots

Edit `src/utils/timeSlots.js` to change available hours or booking window.

## 🌐 Deployment Options

### Option 1: GitHub Pages (Free)

1. Build your project:
```bash
npm run build
```

2. Install GitHub Pages plugin:
```bash
npm install --save-dev gh-pages
```

3. Add to `package.json`:
```json
"scripts": {
  "deploy": "gh-pages -d dist"
}
```

4. Deploy:
```bash
npm run deploy
```

**Note**: GitHub Pages is great for static sites and is free, but:
- Your site will be at `username.github.io/repo-name`
- For a custom domain, you'll need to purchase one separately
- Data is stored in localStorage (browser only)

### Option 2: Netlify (Recommended for Free Custom Domain)

1. Push your code to GitHub
2. Sign up at [Netlify.com](https://netlify.com)
3. Connect your GitHub repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Netlify offers free SSL and a custom domain option

### Option 3: Vercel

Similar to Netlify, Vercel offers easy deployment:
1. Push to GitHub
2. Import project on [Vercel.com](https://vercel.com)
3. Deploy automatically

## 🔒 Security & Production Considerations

### Current Setup (Development)
- Bookings are stored in **localStorage** (browser only)
- No backend server required
- Perfect for testing and small-scale use

### For Production/Profit
You'll need:

1. **Backend API** for:
   - Secure booking storage
   - Email notifications
   - Payment processing
   - User authentication

2. **Database** (Firebase, Supabase, or custom):
   - Store bookings securely
   - Handle concurrent bookings
   - Backup data

3. **Custom Domain**:
   - Professional appearance
   - Better SEO
   - Brand recognition
   - Cost: ~$10-15/year

4. **Email Service** (SendGrid, Mailgun):
   - Booking confirmations
   - Reminders
   - Cancellations

5. **Payment Integration** (Stripe, PayPal):
   - Accept deposits/payments
   - Refund handling

## 💡 Recommended Tech Stack for Production

- **Frontend**: React (current)
- **Backend**: Node.js/Express or Firebase
- **Database**: Firebase Firestore, Supabase, or PostgreSQL
- **Hosting**: Netlify, Vercel, or AWS
- **Domain**: Namecheap, Google Domains, or Cloudflare

## 🖼️ Gallery & Pricing API

The website now includes a backend API for managing gallery images and service prices.

### Backend Setup

1. **Navigate to server directory**:
   ```bash
   cd server
   npm install
   ```

2. **Start the API server**:
   ```bash
   npm start
   ```

3. **Deploy to Render**: See `RENDER_DEPLOY.md` for detailed instructions

### API Endpoints

- **Gallery**: `/api/gallery` - Manage portfolio images
- **Prices**: `/api/prices` - Manage service pricing
- **Health**: `/api/health` - API status check

## 📝 Future Enhancements

- [x] Photo gallery
- [x] Service pricing API
- [ ] Admin dashboard for managing gallery/prices
- [ ] Email notifications
- [ ] Payment integration
- [ ] Calendar sync
- [ ] SMS reminders
- [ ] Review system

## 🤝 Contributing

Feel free to fork this project and customize it for your salon!

## 📄 License

This project is open source and available for personal and commercial use.

## 💬 Support

For questions or issues, please open an issue on GitHub.

---

**Built with ❤️ for Touba Hair Salon**

