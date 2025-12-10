# MongoDB Connection Setup Guide

## Your MongoDB Connection String

Your MongoDB Atlas connection string:
```
mongodb+srv://hadeemsecka_db_user:VKlZvXscWjzLYwrG@cluster0.er5izge.mongodb.net/?appName=Cluster0
```

## ✅ Updated Connection String (with database name)

For the application to work properly, add the database name to your connection string:

```
mongodb+srv://hadeemsecka_db_user:VKlZvXscWjzLYwrG@cluster0.er5izge.mongodb.net/touba-hair?retryWrites=true&w=majority
```

## 🔧 Setup Instructions

### Option 1: Environment Variable (Recommended)

1. **For Local Development:**
   - Create a `.env` file in the `server/` directory
   - Add your connection string:
     ```
     MONGODB_URI=mongodb+srv://hadeemsecka_db_user:VKlZvXscWjzLYwrG@cluster0.er5izge.mongodb.net/touba-hair?retryWrites=true&w=majority
     ```

2. **For Render (Production):**
   - Go to your Render dashboard
   - Select your service
   - Go to "Environment" tab
   - Add environment variable:
     - **Key**: `MONGODB_URI`
     - **Value**: `mongodb+srv://hadeemsecka_db_user:VKlZvXscWjzLYwrG@cluster0.er5izge.mongodb.net/touba-hair?retryWrites=true&w=majority`

### Option 2: Automatic Database Name Addition

The server will automatically add the database name `touba-hair` if your connection string doesn't include one. However, it's better to include it explicitly.

## 🔒 Security Checklist

- ✅ Connection string includes database name
- ✅ Connection string includes `retryWrites=true&w=majority` for reliability
- ✅ MongoDB Atlas IP whitelist includes `0.0.0.0/0` (allows all IPs) OR your Render IP
- ✅ Database user has proper permissions
- ✅ Connection string is stored in environment variables (not in code)

## 🧪 Testing the Connection

1. Start your server:
   ```bash
   cd server
   npm start
   ```

2. Look for these success messages:
   ```
   ✅ Connected to MongoDB successfully!
   📊 Database: touba-hair
   🌐 Host: cluster0.er5izge.mongodb.net
   🔌 Ready State: Connected
   ```

3. If you see errors, check:
   - Connection string format
   - MongoDB Atlas IP whitelist settings
   - Database user permissions
   - Network connectivity

## 📝 Connection String Format

The correct format is:
```
mongodb+srv://[username]:[password]@[cluster]/[database-name]?[options]
```

Where:
- `[username]`: Your MongoDB username
- `[password]`: Your MongoDB password (URL-encoded if special characters)
- `[cluster]`: Your cluster address
- `[database-name]`: Database name (e.g., `touba-hair`)
- `[options]`: Connection options like `retryWrites=true&w=majority`

## 🚨 Common Issues

### Issue: "MongoServerError: bad auth"
- **Solution**: Check username and password are correct

### Issue: "MongoServerError: IP not whitelisted"
- **Solution**: Add `0.0.0.0/0` to MongoDB Atlas IP whitelist (or your Render IP)

### Issue: "MongooseServerSelectionError: connection timed out"
- **Solution**: Check network connectivity and MongoDB Atlas cluster status

### Issue: Database name not found
- **Solution**: MongoDB will create the database automatically on first use, or ensure the database name is correct

## 🔄 Connection Retry Logic

The server includes automatic retry logic:
- Retries up to 5 times
- 5-second delay between retries
- Logs retry attempts for debugging

## 📞 Support

If you continue to have connection issues:
1. Check MongoDB Atlas dashboard for cluster status
2. Verify IP whitelist settings
3. Check database user permissions
4. Review server logs for detailed error messages

---

**Last Updated**: Current date
**Database Name**: `touba-hair`
**Cluster**: `cluster0.er5izge.mongodb.net`
