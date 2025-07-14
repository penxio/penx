import { resolve } from 'path'
import { lingui } from '@lingui/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin({
        exclude: [
          '@penx/api',
          '@penx/components',
          '@penx/constants',
          '@penx/content-render',
          '@penx/contexts',
          '@penx/domain',
          '@penx/emitter',
          '@penx/encryption',
          '@penx/extension-api',
          '@penx/hooks',
          '@penx/icons',
          '@penx/libs',
          '@penx/local-db',
          '@penx/locales',
          '@penx/model-type',
          '@penx/novel-editor',
          '@penx/query-client',
          '@penx/services',
          '@penx/session',
          '@penx/store',
          '@penx/types',
          '@penx/uikit',
          '@penx/unique-id',
          '@penx/utils',
          '@penx/vaul',
          '@penx/widgets',
        ],
      }),
    ],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    define: {
      'process.env': {},
      global: {},
    },
    resolve: {
      alias: {
        '~': resolve('src/renderer/src'),
      },
    },
    plugins: [
      react({
        babel: {
          plugins: ['@lingui/babel-plugin-lingui-macro'],
        },
      }),
      lingui(),
    ],
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/renderer/index.html'),
          panel: resolve(__dirname, 'src/renderer/panel.html'),
        },
      },
    },
  },
})
