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

/** @type {import('@lingui/conf').LinguiConfig} */
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
      include: [
        '<rootDir>/apps/**/*.{ts,tsx}',
        '<rootDir>/packages/**/*.{ts,tsx}',
      ],
      exclude: ['**/node_modules/**', '**/*.d.ts'],
    },
  ],
}
