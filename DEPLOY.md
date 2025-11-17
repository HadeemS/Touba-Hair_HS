# Deploying to GitHub Pages

## Quick Deploy Steps

1. **Install dependencies** (if you haven't already):
   ```bash
   npm install
   ```

2. **Update the base path** in `vite.config.js`:
   - If your repository is `username.github.io`, change `base: '/Touba-Hair_HS/'` to `base: '/'`
   - Otherwise, make sure `base: '/Touba-Hair_HS/'` matches your repository name

3. **Build and deploy**:
   ```bash
   npm run deploy
   ```

4. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under **Source**, select **gh-pages branch**
   - Click **Save**

5. **Wait a few minutes** for GitHub to build your site
   - Your site will be available at: `https://yourusername.github.io/Touba-Hair_HS/`

## Important Notes

- **Repository Name**: Make sure the base path in `vite.config.js` matches your repository name exactly
- **404.html**: This file handles routing for GitHub Pages (SPA routing)
- **Build Output**: The `dist` folder is deployed to the `gh-pages` branch
- **Custom Domain**: If you have a custom domain, you'll need to update the base path to `/`

## Troubleshooting

### Blank Page Issue
If you see a blank page:
1. Check the browser console (F12) for errors
2. Verify the base path in `vite.config.js` matches your repo name
3. Make sure `404.html` is in the root directory
4. Check that GitHub Pages is set to use the `gh-pages` branch

### Routes Not Working
- The `404.html` file handles client-side routing
- Make sure it's in the root of your repository
- GitHub Pages will serve this file for all 404 errors

### Assets Not Loading
- Check that the base path is correct
- Verify all assets are in the `dist` folder after building
- Clear browser cache and try again

