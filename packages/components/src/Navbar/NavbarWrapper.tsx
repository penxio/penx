'use client'

import React, { HTMLAttributes, PropsWithChildren, useMemo } from 'react'
import { useSession } from '@penx/session'
import { Link, usePathname } from '@/lib/i18n'
import { cn } from '@penx/utils'
import { Merienda } from 'next/font/google'
import { ProfilePopover } from '../Profile/ProfilePopover'
import { useSiteContext } from '../SiteContext'

const merienda = Merienda({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

interface Props extends HTMLAttributes<HTMLDivElement> {}
export function NavbarWrapper({
  children,
  ...rest
}: PropsWithChildren & Props) {
  const pathname = usePathname()!
  const { data: session } = useSession()
  const isPost = pathname.startsWith(`/~/post/`)
  const site = useSiteContext()

  const topRightJSX = useMemo(() => {
    if (isPost) return null
    return (
      <div className="flex gap-2">
        <ProfilePopover />
      </div>
    )
  }, [session, isPost])

  return (
    <div
      className={cn(
        'bg-background sticky top-0 z-50 flex h-14 items-center justify-between border-b px-3',
        rest.className,
      )}
    >
      <div>
        <Link href="/" className={cn('text-2xl font-bold', merienda.className)}>
          {site.name}
        </Link>
      </div>
      <div className="flex-1"></div>

      {topRightJSX}
    </div>
  )
}
