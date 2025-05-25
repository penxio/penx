import { i18n } from '@lingui/core'

export async function dynamicActivate(locale: string) {
  // const { messages } = await import(`./locales/${locale}.po`)
  const { messages } = await import(`./locales/zh-CN.po`)
  console.log('======>>>>>>>>>messages:', messages)

  i18n.load(locale, messages)
  i18n.activate(locale)
}
