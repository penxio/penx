import path from 'path'
import { fileURLToPath } from 'url'
import { lingui } from '@lingui/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// @ts-ignores
const host = process.env.TAURI_DEV_HOST

// console.log(
//   '>>>>>>>>>>>>>>>--dirName',
//   __dirname,
//   path.resolve(__dirname, '../../node_modules/.prisma/client'),
// )

console.log(
  '=======>>>>>:',
  fileURLToPath(new URL('../../packages/db/src', import.meta.url)),
)

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [
    react(),
    lingui(),
    tailwindcss(),
    tsconfigPaths({
      loose: true,
    }),
  ],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
  },
  envPrefix: ['VITE_', 'TAURI_'],
  define: {
    'process.env': {},
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@penx/db': fileURLToPath(
        new URL('../../packages/db/src', import.meta.url),
      ),
    },
  },
}))
