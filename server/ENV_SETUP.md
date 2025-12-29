# How to Set Up Your .env File

## Step 1: Create the .env File

Create a file named `.env` (exactly that name, no extension) in the `server` directory.

**Location:** `server/.env`

## Step 2: Get Your MongoDB Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Log in to your account
3. Click on your cluster (or create one if you don't have one)
4. Click **"Connect"** button
5. Select **"Connect your application"**
6. Copy the connection string (it will look like this):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 3: Format Your Connection String

Replace the placeholders in the connection string:

- Replace `<username>` with your MongoDB Atlas username
- Replace `<password>` with your MongoDB Atlas password
- Add your database name after `.net/` (before the `?`)

**Example:**
```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/touba-hair?retryWrites=true&w=majority
```

### Important: Special Characters in Password

If your password contains special characters, you need to URL-encode them:

| Character | Encoded |
|-----------|---------|
| `@` | `%40` |
| `#` | `%23` |
| `$` | `%24` |
| `%` | `%25` |
| `&` | `%26` |
| `+` | `%2B` |
| `=` | `%3D` |
| `?` | `%3F` |
| `/` | `%2F` |
| ` ` (space) | `%20` |

**Example:** If your password is `MyP@ss#123`, use `MyP%40ss%23123`

## Step 4: Create Your .env File

Create `server/.env` with this content:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/touba-hair?retryWrites=true&w=majority
JWT_SECRET=your-random-secret-key-here-make-it-long-and-random
FRONTEND_URL=http://localhost:5173
```

### Required Variables:

1. **MONGODB_URI** - Your MongoDB connection string (REQUIRED)
2. **JWT_SECRET** - A random string for signing authentication tokens (REQUIRED)
   - Generate one: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. **FRONTEND_URL** - Your frontend URL (REQUIRED for CORS)
   - Local development: `http://localhost:5173`
   - Production: Your actual website URL

### Optional Variables:

- **MONGODB_DB_NAME** - Database name (if not in MONGODB_URI)
- **PORT** - Server port (defaults to 3000)

## Step 5: Verify Your Connection String

Your connection string should:
- ✅ Start with `mongodb+srv://`
- ✅ Have format: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/database-name?retryWrites=true&w=majority`
- ✅ End with `.mongodb.net` (not `.mongod...` or anything else)
- ✅ Have the database name after `.net/` (e.g., `/touba-hair`)

## Step 6: Test It

After creating your `.env` file, test the connection:

```bash
cd server
node scripts/seedEmployees.js
```

You should see:
```
📄 Loaded .env from server directory
🔌 Connecting to MongoDB...
   Host: cluster0.xxxxx.mongodb.net
✅ Connected to MongoDB
```

## Troubleshooting

### Error: "ENOTFOUND" or "querySrv ENOTFOUND"
- Your connection string hostname is malformed
- Check that it ends with `.mongodb.net`
- Make sure there are no extra characters or typos

### Error: "Authentication failed"
- Your username or password is incorrect
- Make sure special characters in password are URL-encoded
- Check your MongoDB Atlas username/password

### Error: "MONGODB_URI environment variable is not set"
- Make sure the file is named exactly `.env` (not `.env.txt` or `.env.example`)
- Make sure it's in the `server` directory
- Make sure `MONGODB_URI=...` is on a single line (no line breaks)

## Security Note

⚠️ **NEVER commit your `.env` file to git!** It contains sensitive information.

The `.env` file should already be in `.gitignore`, but double-check to make sure.

