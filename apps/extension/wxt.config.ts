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
        global: 'globalThis',
      },
      optimizeDeps: {
        exclude: ['@electric-sql/pglite'],
      },
      build: {
        rollupOptions: {
          external: ['fs', 'path', 'os'],
        },
      },
    } as any
  },
  manifest: {
    name: 'PenX',
    description: 'AI Powered Personal Data Hub',
    host_permissions: ['<all_urls>'],
    action: {},
    permissions: [
      'bookmarks',
      'storage',
      'tabs',
      'activeTab',
      'favicon',
      'sidePanel',
      'commands',
      'unlimitedStorage',
    ],
    content_security_policy: {
      extension_pages:
        "default-src 'self'; script-src 'self' 'wasm-unsafe-eval' http://localhost:3000; style-src 'self' 'unsafe-inline'; img-src * data:; connect-src 'self' ws://localhost:3000 http://localhost:3000 https://penx.io https://sync.penx.io https://api.iconify.design https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/ort-wasm-simd-threaded.wasm http://localhost:14158 ws://localhost:14158;",
    },

    web_accessible_resources: [
      {
        resources: ['_favicon/*', 'pglite/*'],
        matches: ['<all_urls>'],
      },
    ],
    commands: {
      'toggle-sidepanel': {
        suggested_key: {
          default: 'Alt+S',
          mac: 'Alt+S',
        },
        description: 'Toggle sidepanel',
      },
      // 'toggle-panel': {
      //   suggested_key: {
      //     default: 'Alt+P',
      //     mac: 'Alt+P',
      //   },
      //   description: 'Toggle panel',
      // },
    },
  },
})
