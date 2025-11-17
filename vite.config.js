import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'
import { resolve } from 'path'

// GitHub Pages base path - change this to your repository name
// If your repo is "username.github.io", use base: '/'
// Otherwise, use base: '/your-repo-name/'
const base = '/Touba-Hair_HS/'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-404',
      closeBundle() {
        // Copy 404.html to dist folder for GitHub Pages SPA routing
        try {
          copyFileSync(
            resolve(__dirname, '404.html'),
            resolve(__dirname, 'dist', '404.html')
          )
        } catch (err) {
          console.warn('Could not copy 404.html:', err.message)
        }
      }
    }
  ],
  base: base,
})

