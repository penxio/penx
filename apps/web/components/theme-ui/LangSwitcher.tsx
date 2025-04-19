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
} from '@penx/ui/components/select'
import { usePathname } from '@/lib/i18n'
import { langMap } from '@/lib/supportLanguages'
import { Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import { useLingui } from '@lingui/react'
import { Trans } from '@lingui/react/macro'
import { useRouter } from 'next/navigation'

type LOCALES = 'en' | 'ja' | 'ko' | 'fr' | 'ru' | 'zh-CN'

interface LangSwitcherProps {
  className?: string
  site: Site
}

export function LangSwitcher({ className, site }: LangSwitcherProps) {
  const router = useRouter()
  const { i18n } = useLingui()
  const pathname = usePathname()

  // console.log('====i18n.locale:', i18n.locale)

  const [locale, setLocale] = useState<LOCALES>(
    // pathname?.split('/')[1] as LOCALES,
    i18n.locale as any,
  )
  const { locales = [] } = site.config || {}

  if (!locales.length) return null

  function handleChange(value: string) {
    const locale = value as LOCALES

    const newPath =
      value === 'default' ? `${pathname}` : `/${locale}${pathname}`

    setLocale(locale)
    router.push(newPath)
  }

  if (!locale) return null

  return (
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger
        className={cn(
          'text-foreground/60 flex h-auto w-auto border-none bg-transparent px-0 py-0',
          className,
        )}
      >
        <SelectValue placeholder="Select a lang" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value={'default'}>
            <Trans>Default</Trans>
          </SelectItem>
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
