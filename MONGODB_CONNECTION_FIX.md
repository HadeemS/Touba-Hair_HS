# MongoDB Connection String Fix

## Problem
Error: `Invalid namespace specified: /touba-hair.users`

This error occurs when the MongoDB connection string has the database name in the wrong format or location.

## Solution

The connection string parser has been fixed to properly handle:
- MongoDB Atlas (`mongodb+srv://`) connections
- Standard MongoDB (`mongodb://`) connections
- Database name placement
- Query parameter handling

## Correct Connection String Format

### MongoDB Atlas (Recommended)
```
mongodb+srv://username:password@cluster.mongodb.net/touba-hair?retryWrites=true&w=majority
```

**Key points:**
- Database name (`touba-hair`) comes AFTER the cluster URL and BEFORE the `?`
- Format: `mongodb+srv://[credentials]@[cluster]/[database]?[options]`

### Standard MongoDB
```
mongodb://username:password@host:port/touba-hair
```

## How to Fix in Render

1. **Go to Render Dashboard** → Your Service → Environment
2. **Check `MONGODB_URI`** - it should look like:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/touba-hair?retryWrites=true&w=majority
   ```
3. **If it's missing the database name**, add `/touba-hair` before the `?` (or at the end if no `?`)
4. **Save and redeploy**

## Common Issues

### Issue 1: Database name in wrong place
**Wrong:**
```
mongodb+srv://user:pass@cluster.mongodb.net?db=touba-hair
```

**Correct:**
```
mongodb+srv://user:pass@cluster.mongodb.net/touba-hair?retryWrites=true&w=majority
```

### Issue 2: Double slashes
**Wrong:**
```
mongodb+srv://user:pass@cluster.mongodb.net//touba-hair
```

**Correct:**
```
mongodb+srv://user:pass@cluster.mongodb.net/touba-hair
```

### Issue 3: Database name with special characters
If your database name has special characters, they should be URL-encoded, but `touba-hair` is fine as-is.

## Testing

After fixing the connection string:

1. **Redeploy on Render**
2. **Check logs** - should see:
   ```
   Connecting to MongoDB: mongodb+srv://username:***@cluster.mongodb.net/touba-hair
   ✅ MongoDB Connected Successfully!
   ```
3. **Test login** - should work now
4. **Call `/api/test-db`** to verify connection

## Quick Fix Command

If you have access to MongoDB Atlas, you can also verify the connection string format:

```bash
# Test connection (replace with your actual URI)
mongosh "mongodb+srv://username:password@cluster.mongodb.net/touba-hair?retryWrites=true&w=majority"
```

If this connects successfully, use the exact same string in Render's `MONGODB_URI` environment variable.

