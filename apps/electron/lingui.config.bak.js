import { defineConfig } from '@lingui/cli'

export default defineConfig({
  sourceLocale: 'en',
  locales: ['cs', 'en'],
  catalogs: [
    {
      path: '<rootDir>/src/renderer/src/locales/{locale}',
      include: ['src']
    }
  ]
})
