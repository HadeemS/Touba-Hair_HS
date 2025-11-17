# Fix for 404 Error on GitHub Pages

## The Problem
You're seeing a 404 error for `main.jsx` because GitHub Pages is serving the source files instead of the built files.

## Solution: Deploy the Built Files

### Option 1: Manual Deploy (Recommended)

1. **Build your project**:
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```

3. **Verify GitHub Pages Settings**:
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under **Source**, make sure it says **"Deploy from a branch"**
   - Select **Branch: `gh-pages`** and **Folder: `/ (root)`**
   - Click **Save**

4. **Wait 2-3 minutes** for GitHub to update

5. **Check your site**: `https://yourusername.github.io/Touba-Hair_HS/`

### Option 2: Automatic Deploy with GitHub Actions

I've created a GitHub Actions workflow (`.github/workflows/deploy.yml`) that will automatically deploy when you push to the `main` branch.

1. **Commit and push the workflow file**:
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "Add GitHub Actions deployment"
   git push
   ```

2. **Update GitHub Pages Settings**:
   - Go to **Settings** → **Pages**
   - Change source to **"GitHub Actions"**
   - Save

3. **Push to main branch** - it will auto-deploy!

## Verify Deployment

After deploying, check:
1. The `gh-pages` branch should contain the `dist` folder contents
2. The `index.html` in `gh-pages` should reference `/Touba-Hair_HS/assets/...` (not `/src/main.jsx`)
3. Your site URL should work without 404 errors

## If Still Not Working

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Check the built files**: Look in `dist/index.html` - it should have paths like `/Touba-Hair_HS/assets/...`
3. **Verify repository name**: Make sure `vite.config.js` has `base: '/Touba-Hair_HS/'` matching your repo name exactly
4. **Check browser console**: Look for any other errors

