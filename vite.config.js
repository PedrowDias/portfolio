import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path matches the GitHub Pages project site URL: username.github.io/portfolio
export default defineConfig({
  plugins: [react()],
  base: '/portfolio/',
})
