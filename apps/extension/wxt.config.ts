import { lingui } from '@lingui/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
// import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  react: {
    vite: {
      babel: {
        plugins: ['@lingui/babel-plugin-lingui-macro'],
      },
    },
  },
  outDir: 'dist',
  vite: ({ mode }) => {
    return {
      plugins: [lingui(), tailwindcss()],
      define: {
        'process.env': {},
      },
    }
  },
  manifest: {
    name: 'PenX',
    description: 'AI Powered Personal Data Hub',
    host_permissions: ['<all_urls>'],
    permissions: ['bookmarks', 'storage', 'tabs', 'activeTab', 'favicon'],
    web_accessible_resources: [
      {
        resources: ['_favicon/*'],
        matches: ['<all_urls>'],
      },
    ],
  },
})
