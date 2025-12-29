# Testing the Braiders API

## Quick Test

Open your browser and visit:
```
https://touba-hair-hs-1.onrender.com/api/braiders
```

Or if running locally:
```
http://localhost:3000/api/braiders
```

You should see JSON like:
```json
{
  "braiders": [
    {
      "id": "...",
      "name": "Jabu",
      "location": "Sandhills",
      ...
    }
  ]
}
```

## If You See an Empty Array `{"braiders": []}`

1. **Check if employees exist in database:**
   ```bash
   cd server
   node scripts/checkEmployees.js
   ```

2. **Verify employees have `isActive: true`:**
   - All employees should show `✅` in the check script output

3. **Check server logs:**
   - Look for the log message: `Found X braiders` in your server console

## If You Get a Connection Error

1. **Check if server is running:**
   - Visit: `https://touba-hair-hs-1.onrender.com/api/health`
   - Should return server status

2. **Check frontend API URL:**
   - Open browser console (F12)
   - Look for: `API Base URL: ...`
   - Make sure it matches your server URL

3. **If running locally:**
   - Create `.env` file in project root with:
     ```
     VITE_API_URL=http://localhost:3000
     ```
   - Restart your frontend dev server

## Common Issues

### Issue: "No stylists found" on booking page
**Solution:** 
- Check browser console (F12) for error messages
- Verify API endpoint returns braiders (test URL above)
- Make sure server is running and connected to MongoDB

### Issue: CORS error
**Solution:**
- Check `server/server.js` has CORS configured
- Verify `FRONTEND_URL` in server `.env` matches your frontend URL

### Issue: API returns empty array
**Solution:**
- Run seed script again: `node server/scripts/seedEmployees.js`
- Check employees exist: `node server/scripts/checkEmployees.js`
- Verify `isActive: true` for all employees

