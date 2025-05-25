const supportLanguages = [
  ['en', 'English'],
  ['zh-CN', '简体中文'],
  ['ja', '日本語'],
  ['fr', 'Français'],
  ['de', 'Deutsch'],
  ['ru', 'Русский'],
  ['ko', '한국어'],
]

const langs = supportLanguages.map(([lang]) => lang)

// /** @type {import('@lingui/conf').LinguiConfig} */
export default {
  locales: [...langs, 'pseudo'],
  pseudoLocale: 'pseudo',
  sourceLocale: 'en',
  fallbackLocales: {
    default: 'en',
  },
  catalogs: [
    {
      path: '<rootDir>/packages/locales/src/locales/{locale}',
      include: ['<rootDir>/apps/**/*.tsx', '<rootDir>/packages/**/*.tsx'],
      exclude: ['**/node_modules/**'],
    },

    {
      path: '<rootDir>/apps/web/locales/{locale}',
      include: ['<rootDir>/apps/**/*.tsx', '<rootDir>/packages/**/*.tsx'],
      exclude: ['**/node_modules/**'],
    },

    {
      path: '<rootDir>/apps/mobile/src/locales/{locale}',
      include: ['<rootDir>/apps/**/*.tsx', '<rootDir>/packages/**/*.tsx'],
      exclude: ['**/node_modules/**'],
    },

    {
      path: '<rootDir>/apps/extension/locales/{locale}',
      include: ['<rootDir>/apps/**/*.tsx', '<rootDir>/packages/**/*.tsx'],
      exclude: ['**/node_modules/**'],
    },
  ],
}
