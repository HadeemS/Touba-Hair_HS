# Quick Start Guide

## 🚀 Getting Your Website Running

### Step 1: Install Dependencies
Open your terminal in VS Code (or Command Prompt) and run:
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

Your website will open at `http://localhost:5173`

### Step 3: Make Changes
- Edit files in the `src` folder
- Changes will automatically reload in your browser
- Press `Ctrl+C` in terminal to stop the server

## 📝 Common Tasks

### Add a New Braider
1. Open `src/data/braiders.js`
2. Add a new braider object to the array
3. Save and see it appear on the booking page

### Change Colors
1. Open `src/index.css`
2. Find the `:root` section
3. Modify the color variables (e.g., `--primary-pink`)

### Update Contact Info
1. Open `src/components/Footer.jsx`
2. Update phone, email, and address
3. Save to see changes

## 🌐 Deploying Your Website

### For Testing (GitHub Pages)
1. Build: `npm run build`
2. Push to GitHub
3. Enable GitHub Pages in repository settings
4. Your site will be live at `username.github.io/Touba-Hair_HS`

### For Production (Netlify - Recommended)
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com) and sign up
3. Click "New site from Git"
4. Connect your GitHub repo
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy"
7. Get a free custom domain or connect your own

## 💡 Tips

- **VS Code Extensions**: Install "ES7+ React/Redux/React-Native snippets" for better coding
- **Testing**: Test booking flow on different devices
- **Backup**: Always commit changes to GitHub before major edits
- **Custom Domain**: You can buy one from Namecheap ($10-15/year) and connect it to Netlify

## ❓ Need Help?

Check the main README.md for detailed information about:
- Project structure
- Customization options
- Security considerations
- Production setup

