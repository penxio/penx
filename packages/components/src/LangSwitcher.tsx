'use client'

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@penx/uikit/select'
import { usePathname } from '@penx/libs/i18n'
import { langMap } from '@/lib/supportLanguages'
import { cn } from '@penx/utils'
import { msg } from '@lingui/core/macro'
import { useLingui } from '@lingui/react'
import { useRouter } from 'next/navigation'

type LOCALES = 'en' | 'ja' | 'ko' | 'fr' | 'ru' | 'zh-CN'

interface LangSwitcherProps {
  className?: string
  locales?: string[]
}

export function LangSwitcher({
  className,
  locales = ['en', 'ja', 'ru', 'zh-CN'],
}: LangSwitcherProps) {
  const router = useRouter()
  const { i18n } = useLingui()
  const pathname = usePathname()

  const [locale, setLocale] = useState<LOCALES>(
    // pathname?.split('/')[1] as LOCALES,
    i18n.locale as any,
  )

  function handleChange(value: string) {
    const locale = value as LOCALES

    // console.log('=====pathname:', pathname, 'locale:', locale)

    // const pathNameWithoutLocale = pathname?.split('/')?.slice(2) ?? []
    const newPath = `/${locale}/${pathname}`

    setLocale(locale)
    router.push(newPath)
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
