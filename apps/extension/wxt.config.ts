import { lingui } from '@lingui/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
// import react from '@vitejs/plugin-react-swc'
// import react from '@vitejs/plugin-react'
import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  outDir: 'dist',
  vite: ({ mode }) => {
    return {
      plugins: [tailwindcss()],
      define: {
        'process.env': {},
      },
    }
  },
  manifest: {
    name: 'PenX',
    description: 'A structured note-taking App for creators',
    host_permissions: ['<all_urls>'],
  },
})
