import path from 'path'
import { lingui } from '@lingui/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react({
      // babel: {
      //   plugins: ['@lingui/babel-plugin-lingui-macro'],
      // },
    }),
    // lingui(),
  ],
  optimizeDeps: {
    exclude: ['@penx/locales', '@lingui/core/macro'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
