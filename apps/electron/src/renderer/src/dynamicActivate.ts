import { i18n } from '@lingui/core'
import { detect, fromNavigator, fromStorage, fromUrl } from '@lingui/detect-locale'
import { messages as en } from './locales/en.po'

export function dynamicActivate() {
  // const { messages } = await import(`./locales/${locale}.po`)

  console.log('en====:', en)

  // i18n.load(locale, messages)
  // i18n.load({
  //   en,
  //   zh_CN,
  //   fr,
  //   ja,
  //   de,
  //   ru,
  //   ko,
  //   'zh-CN': zh_CN,
  // })

  const defaultLocale = 'en'

  i18n.activate(defaultLocale)
}
