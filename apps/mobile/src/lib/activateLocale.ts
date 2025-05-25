import { i18n } from '@lingui/core'

export async function activateLocale(locale: string = 'en') {
  const { messages } = await import(`../locales/${locale}.po`)
  console.log('======>>>>>>>>>messages:', messages)
  i18n.load(locale, messages)
  i18n.activate(locale)
}
