'use client'

import linguiConfig from '@/lingui.config'
import { useLingui } from '@lingui/react'
import { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import NextLink from 'next/link'
import {
  usePathname as usePathnameNext,
  useRouter as useRouterNext,
} from 'next/navigation'

type Props = React.ComponentPropsWithoutRef<typeof NextLink> & {
  isSite?: boolean
}

const locales = linguiConfig.locales as string[]

export function Link({ isSite = false, ...props }: Props) {
  const pathname = usePathnameNext()!

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )
  const { i18n } = useLingui()
  const prefix = pathnameHasLocale ? `/${i18n.locale}` : ''
  const href = isSite ? props.href : `${prefix}${props.href}`

  return <NextLink {...props} href={href}></NextLink>
}

export function useRouter() {
  const { i18n } = useLingui()
  const router = useRouterNext()
  return {
    ...router,
    push(href: string, options?: NavigateOptions) {
      router.push(`/${i18n.locale}${href}`, options)
    },
  }
}

export function usePathname() {
  const { i18n } = useLingui()
  const pathname = usePathnameNext() || ''
  return pathname.replace(`/${i18n.locale}`, '') || '/'
}
