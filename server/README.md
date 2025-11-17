# Touba Hair Salon API

Backend API for managing gallery images and service prices.

## Setup

1. **Install dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Start the server**:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

3. **Server runs on**: `http://localhost:3000`

## API Endpoints

### Gallery

- `GET /api/gallery` - Get all gallery images
- `GET /api/gallery/:id` - Get single image
- `POST /api/gallery` - Add new image (requires multipart/form-data with `image` file)
- `PUT /api/gallery/:id` - Update image details
- `DELETE /api/gallery/:id` - Delete image

### Prices

- `GET /api/prices` - Get all service prices
- `GET /api/prices/:id` - Get single price
- `POST /api/prices` - Add new price
- `PUT /api/prices/:id` - Update price
- `DELETE /api/prices/:id` - Delete price

## Deploying to Render

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Build settings**:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
4. **Environment Variables**:
   - `PORT` (optional, Render sets this automatically)
5. **Deploy!**

The API will be available at: `https://your-app-name.onrender.com`

