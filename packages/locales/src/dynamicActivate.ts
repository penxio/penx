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
import { messages as de } from './locales/de.po'
import { messages as en } from './locales/en.po'
import { messages as fr } from './locales/fr.po'
import { messages as ja } from './locales/ja.po'
import { messages as ko } from './locales/ko.po'
import { messages as ru } from './locales/ru.po'
import { messages as zh_CN } from './locales/zh-CN.po'

export  function dynamicActivate(locale = '') {
  // const { messages } = await import(`./locales/${locale}.po`)

  // i18n.load(locale, messages)
  i18n.load({
    en,
    zh_CN,
    fr,
    ja,
    de,
    ru,
    ko,
    'zh-CN': zh_CN,
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
