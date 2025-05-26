// @ts-nocheck
'use client'

import { i18n } from '@lingui/core'
import {
  detect,
  fromNavigator,
  fromStorage,
  fromUrl,
} from '@lingui/detect-locale'
import { LOCALE, locales } from '@penx/constants'
import { messages as enMessages } from './locales/en.po'
import { messages as jaMessages } from './locales/ja.po'
import { messages as zhCNMessages } from './locales/zh-CN.po'

export function dynamicActivate(locale = '') {
  // const { messages } = await import(`./locales/${locale}.po`)

  // i18n.load(locale, messages)
  i18n.load({
    en: enMessages,
    zh_CN: zhCNMessages,
    ja: jaMessages,
    'zh-CN': zhCNMessages,
  })

  const defaultLocale = 'en'

  const detectedLocale =
    typeof window !== 'undefined'
      ? detect(
          locale,
          fromUrl('locale'),
          fromStorage(LOCALE),
          fromNavigator(),
          defaultLocale,
        )
      : detect(defaultLocale)

  if (locales.some((lang) => lang === detectedLocale)) {
    i18n.activate(detectedLocale!)
  } else {
    i18n.activate(defaultLocale)
  }
}
