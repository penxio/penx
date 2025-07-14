'use client'

import { useEffect, useMemo } from 'react'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { isBrowser } from '@penx/constants'
import { dynamicActivate } from './dynamicActivate'

type Props = {
  children: React.ReactNode
  locale?: string
}


export const LocaleProvider = ({ children, locale }: Props) => {
  useEffect(() => {
    dynamicActivate(locale)
  }, [])
  return <I18nProvider i18n={i18n}>{children}</I18nProvider>
}
