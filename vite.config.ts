import { defineConfig } from 'vite'

// Production Pages builds set GITHUB_PAGES=true → https://robglnn.github.io/aabmath/
const base = process.env.GITHUB_PAGES === 'true' ? '/aabmath/' : '/'

export default defineConfig({
  base,
  server: { host: true, port: 5173 },
  publicDir: 'public',
  build: {
    chunkSizeWarningLimit: 1000,
  },
})
