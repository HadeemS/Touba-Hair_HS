# Deploying API to Render

## Step 1: Deploy Backend API to Render

1. **Go to Render.com** and sign up/login
2. **Click "New +"** → **"Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service**:
   - **Name**: `touba-hair-api` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Root Directory**: Leave empty (or set to root if needed)

5. **Click "Create Web Service"**
6. **Wait for deployment** (usually 2-3 minutes)
7. **Copy your API URL** (e.g., `https://touba-hair-api.onrender.com`)

## Step 2: Update Frontend to Use API

1. **Create `.env` file** in the root of your project:
   ```
   VITE_API_URL=https://touba-hair-hs.onrender.com
   ```

2. **Rebuild your frontend**:
   ```bash
   npm run build
   ```

3. **Redeploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```

**Note**: Your API is already configured at `https://touba-hair-hs.onrender.com`

## Step 3: Test the API

Your API endpoints will be available at:
- Gallery: `https://your-api-name.onrender.com/api/gallery`
- Prices: `https://your-api-name.onrender.com/api/prices`
- Health: `https://your-api-name.onrender.com/api/health`

## Adding Images to Gallery

You can add images using:
- **Postman** or **Insomnia** (API testing tools)
- **curl** command line
- **Frontend admin panel** (if you build one)

### Example: Add Image with curl

```bash
curl -X POST https://your-api-name.onrender.com/api/gallery \
  -F "image=@/path/to/image.jpg" \
  -F "title=Beautiful Box Braids" \
  -F "description=Client showcase" \
  -F "braiderName=Amina" \
  -F "serviceType=Box Braids"
```

## Managing Prices

### Get all prices:
```bash
curl https://your-api-name.onrender.com/api/prices
```

### Add new price:
```bash
curl -X POST https://your-api-name.onrender.com/api/prices \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Style",
    "description": "Description here",
    "price": 150,
    "duration": "4 hours",
    "category": "Braids"
  }'
```

## Important Notes

- **Free Tier**: Render free tier spins down after 15 minutes of inactivity. First request may be slow.
- **Upgrade**: For production, consider Render's paid plans for always-on service
- **Storage**: Images are stored in Render's filesystem. For production, consider cloud storage (AWS S3, Cloudinary)
- **Database**: Currently using JSON files. For production, consider MongoDB or PostgreSQL

## Troubleshooting

### API not responding
- Check Render dashboard for logs
- Verify build and start commands are correct
- Check that PORT environment variable is set (Render sets this automatically)

### Images not loading
- Verify image URLs include the full API URL
- Check CORS settings (already configured in server.js)
- Ensure images are uploaded to `/public/uploads/` directory

### Frontend can't connect
- Verify `.env` file has correct `VITE_API_URL`
- Rebuild frontend after changing `.env`
- Check browser console for CORS errors

