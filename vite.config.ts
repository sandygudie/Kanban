import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import eslint from 'vite-plugin-eslint'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  plugins: [
    tsconfigPaths(),
    react(),
    eslint({ cache: false})
  ],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return
        }
        warn(warning)
      },
    },
  },
})
