import { ReactNode } from 'react'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react'
import { Link } from '@penx/libs/i18n'
import { Site } from '@penx/types'
import { cn } from '@penx/utils'
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
        if (!link.visible) return null

        return <NavigationItem key={link.pathname} link={link} />
      })}

      {site.products.length > 0 && <MembershipEntry />}
    </div>
  )
}
