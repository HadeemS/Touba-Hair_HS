# 🔒 Security & Private Information

## ⚠️ IMPORTANT: Private Files

The following files contain sensitive information and are **NOT** tracked in git:

- `ADMIN_CREDENTIALS.md` - Admin account credentials
- `DEMO_CREDENTIALS.md` - Demo/test account credentials  
- `CREATE_ADMIN_ACCOUNT.md` - Admin setup instructions with credentials
- `CREATE_ADMIN.md` - Admin creation guide with credentials
- `YOUR_CONNECTION_STRING.txt` - MongoDB connection string with credentials
- `server/config/braiderCredentials.js` - All braider and admin passwords
- `.env` files - Environment variables with secrets

## ✅ What to Do

1. **Never commit these files to git** - They are in `.gitignore`
2. **Keep them local only** - Store them securely on your machine
3. **Use environment variables** - For production, use Render's environment variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your JWT secret key
   - `FRONTEND_URL` - Your frontend URL

## 📝 Template Files

- `server/config/braiderCredentials.example.js` - Template for braider credentials
  - Copy to `braiderCredentials.js` and fill in your actual credentials
  - The `.example.js` file is safe to commit (no real credentials)

## 🔐 Setting Up Credentials

### For Local Development:
1. Copy `server/config/braiderCredentials.example.js` to `server/config/braiderCredentials.js`
2. Fill in your actual credentials
3. The file will be ignored by git automatically

### For Production (Render):
1. Set environment variables in Render dashboard:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A strong random string (32+ characters)
   - `FRONTEND_URL` - Your frontend URL
2. Use the `/api/auth/create-demo-users` endpoint to create accounts
3. Never hardcode credentials in production code

## 🚨 If Credentials Were Committed

If you accidentally committed sensitive files:
1. They are already removed from git tracking
2. **Change all passwords immediately** - They may be in git history
3. Regenerate MongoDB credentials if the connection string was exposed
4. Consider using `git filter-branch` or BFG Repo-Cleaner to remove from history

## 📋 Environment Variables Needed

### Required:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens

### Optional:
- `FRONTEND_URL` - Frontend URL for CORS (defaults to allow all)
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (defaults to 3000)

