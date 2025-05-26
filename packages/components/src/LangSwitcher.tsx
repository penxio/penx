'use client'

import { useState } from 'react'
import { msg } from '@lingui/core/macro'
import { useLingui } from '@lingui/react'
import { langMap, LOCALE } from '@penx/constants'
import { usePathname } from '@penx/libs/i18n'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@penx/uikit/select'
import { cn } from '@penx/utils'

type LOCALES = 'en' | 'ja' | 'ko' | 'fr' | 'ru' | 'zh-CN'

interface LangSwitcherProps {
  className?: string
  locales?: string[]
}

export function LangSwitcher({
  className,
  locales = ['en', 'ja', 'ru', 'zh-CN'],
}: LangSwitcherProps) {
  const { i18n } = useLingui()
  const pathname = usePathname()

  const [locale, setLocale] = useState<LOCALES>(
    // pathname?.split('/')[1] as LOCALES,
    i18n.locale as any,
  )

  function handleChange(value: string) {
    const locale = value as LOCALES

    setLocale(locale)
    i18n.activate(locale)
    localStorage.setItem(LOCALE, locale)
    // router.push(newPath)
  }

  return (
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger
        className={cn(
          'flex h-auto w-auto border-none bg-transparent px-0 py-0',
          className,
        )}
      >
        <SelectValue placeholder="Select a lang" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {locales.map((locale) => {
            return (
              <SelectItem value={locale} key={locale}>
                {langMap.get(locale) || locale}
              </SelectItem>
            )
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
