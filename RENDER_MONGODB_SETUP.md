# Connect MongoDB to Render - Step by Step Guide

## 🔒 Security First
**NEVER** commit your MongoDB connection string to GitHub. Always use environment variables in Render.

---

## Step 1: Get Your MongoDB Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Connect"** on your cluster
3. Select **"Connect your application"**
4. Copy the connection string (it will look like):
   ```
   mongodb+srv://<username>:<password>@cluster0.er5izge.mongodb.net/?appName=Cluster0
   ```

## Step 2: Update Connection String Format

Your connection string needs:
- Database name added
- Connection options added

**Original:**
```
mongodb+srv://username:password@cluster0.er5izge.mongodb.net/?appName=Cluster0
```

**Updated (add `/touba-hair` before the `?`):**
```
mongodb+srv://username:password@cluster0.er5izge.mongodb.net/touba-hair?retryWrites=true&w=majority
```

**Replace:**
- `username` with your MongoDB username
- `password` with your MongoDB password
- Keep `cluster0.er5izge.mongodb.net` (your cluster)
- Add `/touba-hair` (database name)
- Add `?retryWrites=true&w=majority` (connection options)

## Step 3: Configure MongoDB Atlas IP Whitelist

1. Go to MongoDB Atlas Dashboard
2. Click **"Network Access"** in the left sidebar
3. Click **"Add IP Address"**
4. Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
   - OR add your Render service IP address
5. Click **"Confirm"**

⚠️ **Important**: Without this, Render won't be able to connect to MongoDB.

## Step 4: Set Environment Variable in Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your **Web Service** (your backend API)
3. Click **"Environment"** tab in the left sidebar
4. Scroll down to **"Environment Variables"** section
5. Click **"Add Environment Variable"**
6. Enter:
   - **Key**: `MONGODB_URI`
   - **Value**: Your updated connection string (from Step 2)
7. Click **"Save Changes"**

## Step 5: Verify Environment Variable

1. Still in the **"Environment"** tab
2. Scroll down and verify `MONGODB_URI` is listed
3. Make sure the value shows your connection string (it will be hidden/masked for security)

## Step 6: Restart Your Render Service

1. Go to your Render service dashboard
2. Click **"Manual Deploy"** → **"Clear build cache & deploy"**
   - OR wait for automatic redeploy after environment variable change

## Step 7: Test the Connection

1. Wait for deployment to complete (usually 1-2 minutes)
2. Go to your Render service logs
3. Look for:
   ```
   ✅ MongoDB Connected Successfully!
   📊 Database Name: touba-hair
   ```

**OR** test via API:
- Open: `https://your-render-service.onrender.com/api/health`
- Check if `database.isConnected` is `true`

## Step 8: Test Login

1. Try logging in to your application
2. If MongoDB is connected, login should work
3. If you see "Database connection unavailable", check:
   - Environment variable is set correctly
   - IP whitelist includes `0.0.0.0/0`
   - Connection string format is correct

---

## 🔍 Troubleshooting

### Issue: "MongoDB Connection Failed"

**Check:**
1. ✅ Environment variable `MONGODB_URI` is set in Render
2. ✅ Connection string includes database name: `/touba-hair`
3. ✅ Connection string includes options: `?retryWrites=true&w=majority`
4. ✅ MongoDB Atlas IP whitelist includes `0.0.0.0/0`
5. ✅ Username and password are correct
6. ✅ Render service has been restarted after setting environment variable

### Issue: "IP not whitelisted"

**Solution:**
- Go to MongoDB Atlas → Network Access
- Add `0.0.0.0/0` to allow all IPs
- Wait 1-2 minutes for changes to propagate

### Issue: "Bad authentication"

**Solution:**
- Verify username and password in connection string
- Check if password has special characters (may need URL encoding)
- Verify database user has proper permissions

### Issue: Connection works locally but not on Render

**Solution:**
- Double-check environment variable is set in Render (not just locally)
- Verify connection string format matches exactly
- Check Render logs for specific error messages

---

## 📝 Example Connection String Format

```
mongodb+srv://[USERNAME]:[PASSWORD]@cluster0.er5izge.mongodb.net/touba-hair?retryWrites=true&w=majority
```

**Breakdown:**
- `mongodb+srv://` - Protocol
- `[USERNAME]` - Your MongoDB username
- `[PASSWORD]` - Your MongoDB password
- `@cluster0.er5izge.mongodb.net` - Your cluster address
- `/touba-hair` - Database name
- `?retryWrites=true&w=majority` - Connection options

---

## ✅ Success Checklist

- [ ] MongoDB connection string obtained from Atlas
- [ ] Connection string updated with database name and options
- [ ] MongoDB Atlas IP whitelist configured (`0.0.0.0/0`)
- [ ] `MONGODB_URI` environment variable set in Render
- [ ] Render service restarted/redeployed
- [ ] Connection verified via `/api/health` endpoint
- [ ] Login functionality tested and working

---

## 🔐 Security Reminders

- ✅ Never commit connection strings to GitHub
- ✅ Always use environment variables
- ✅ Keep MongoDB credentials secure
- ✅ Regularly rotate passwords
- ✅ Use strong passwords for database users

---

**Need Help?**
- Check Render logs: Dashboard → Your Service → Logs
- Test connection: `https://your-service.onrender.com/api/test-db`
- Check health: `https://your-service.onrender.com/api/health`

