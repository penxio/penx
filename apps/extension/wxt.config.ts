import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  outDir: 'dist',
  vite: () => ({
    plugins: [
      tailwindcss({
        injectVariables: (context) => {
          console.log('========context:', context)

          return `
              :host {
                ${Object.entries(context.theme('colors'))
                  .map(([name, value]) => `--tw-${name}: ${value};`)
                  .join('\n')}
              }
            `
        },
      }),
    ],
  }),
  manifest: {
    host_permissions: ['<all_urls>'],
  },
})
