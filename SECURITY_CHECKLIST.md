# Security Checklist - Before Committing to GitHub

## ⚠️ CRITICAL: Check Before Every Commit

### Files That Should NEVER Be Committed:

1. **Environment Files** (.env)
   - ✅ `server/.env` - Contains MongoDB connection string and JWT secrets
   - ✅ Any `.env` files in root or subdirectories
   - ✅ `.env.local`, `.env.production`, etc.

2. **Credential Files**
   - ✅ `server/employee_credentials.csv` - Contains employee passwords
   - ✅ `server/config/braiderCredentials.js` - Contains braider credentials
   - ✅ `ADMIN_CREDENTIALS.md` - Admin login info
   - ✅ `DEMO_CREDENTIALS.md` - Demo account info
   - ✅ Any file with "credentials" or "password" in the name

3. **Connection Strings**
   - ✅ Any file containing MongoDB connection strings
   - ✅ Files with database passwords

4. **API Keys & Secrets**
   - ✅ JWT secrets
   - ✅ API keys
   - ✅ Authentication tokens

## ✅ Safe to Commit:

- ✅ `.env.example` files (without real values)
- ✅ `braiderCredentials.example.js` (template only)
- ✅ Documentation files (without real credentials)
- ✅ Code files (no hardcoded secrets)

## How to Check Before Committing:

### 1. Check Git Status
```bash
git status
```

### 2. Review What Will Be Committed
```bash
git diff --cached
```

### 3. Search for Sensitive Patterns
```bash
# Search for .env files
git ls-files | grep -E "\.env$|\.env\."

# Search for credential files
git ls-files | grep -i credential

# Search for connection strings
git grep -i "mongodb+srv" --cached
```

## If You Accidentally Committed Sensitive Data:

### ⚠️ IMMEDIATE ACTIONS:

1. **Remove from Git History** (if just pushed):
   ```bash
   git rm --cached server/.env
   git commit -m "Remove sensitive file"
   git push
   ```

2. **If Already on GitHub**:
   - ⚠️ **ROTATE ALL SECRETS IMMEDIATELY**
   - Change MongoDB password
   - Regenerate JWT secret
   - Update all environment variables
   - Use GitHub's secret scanning to check exposure

3. **Clean Git History** (if needed):
   ```bash
   # Use git filter-branch or BFG Repo-Cleaner
   # This rewrites history - be careful!
   ```

## Best Practices:

1. ✅ Always use `.env` files for secrets
2. ✅ Never hardcode passwords in code
3. ✅ Use `.gitignore` to protect sensitive files
4. ✅ Review `git status` before every commit
5. ✅ Use environment variables in production (Render, etc.)

## Current Protected Files:

All these are in `.gitignore` and should NOT appear in `git status`:

- ✅ `server/.env`
- ✅ `server/employee_credentials.csv`
- ✅ `server/config/braiderCredentials.js`
- ✅ `ADMIN_CREDENTIALS.md`
- ✅ `DEMO_CREDENTIALS.md`
- ✅ Any `.env*` files

## Verify Your .gitignore is Working:

```bash
# This should return nothing if .gitignore is working
git status | grep -E "\.env|credentials|password"
```

If you see any of these files in `git status`, they are NOT being ignored!

