import { ReactNode } from 'react'
import { Link } from '@/lib/i18n'
import { Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { MembershipEntry } from './MembershipEntry'
import { NavigationItem } from './NavigationItem'

interface Props {
  site: Site
  className?: string
}

export function Navigation({ site, className }: Props) {
  const links = [
    ...site?.navLinks,
    // {
    //   pathname: '/creator-fi',
    //   title: 'CreatorFi',
    //   visible: true,
    // },
  ]

  return (
    <div
      className={cn(
        'hidden flex-col items-center gap-x-4 gap-y-4 md:flex md:flex-row',
        className,
      )}
    >
      {links.map((link) => {
        if (link.pathname === '/creator-fi' && !site.spaceId) {
          return null
        }

        if (!link.visible) return null

        return <NavigationItem key={link.pathname} link={link} />
      })}

      {site.products.length > 0 && <MembershipEntry />}

      {/* {site.spaceId && (
        <Link
          href="/membership"
          className={cn(
            'font-medium hover:text-brand text-foreground/90',
            'border border-brand text-brand rounded-full px-2 py-1 hover:bg-brand hover:text-background text-sm',
          )}
        >
          Membership
        </Link>
      )} */}
    </div>
  )
}
