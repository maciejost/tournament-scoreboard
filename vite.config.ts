import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // On GitHub Pages the app is served from https://<user>.github.io/tournament-scoreboard/,
  // while local dev/preview stays at the domain root.
  base: command === 'build' ? '/tournament-scoreboard/' : '/',
  plugins: [react(), tailwindcss()],
}))
