import { ReactNode } from 'react'
import { Link } from '@penx/libs/i18n'
import { NavLink } from '@penx/types'
import { cn } from '@penx/utils'
import { Trans } from '@lingui/react'

interface Props {
  link: NavLink
  className?: string
}

export function NavigationItem({ link, className }: Props) {
  let title = link.title as ReactNode
  if (link.pathname === '/') title = <Trans id="Home"></Trans>
  if (link.pathname === '/posts') title = <Trans id="Posts"></Trans>
  if (link.pathname === '/writings') title = <Trans id="Writings"></Trans>
  if (link.pathname === '/podcasts') title = <Trans id="Podcasts"></Trans>
  if (link.pathname === '/notes') title = <Trans id="Notes"></Trans>
  if (link.pathname === '/areas') title = <Trans id="Areas"></Trans>
  if (link.pathname === '/projects') title = <Trans id="Projects"></Trans>
  if (link.pathname === '/friends') title = <Trans id="Friends"></Trans>
  if (link.pathname === '/ama') title = <Trans id="AMA"></Trans>
  if (link.pathname === '/guestbook') title = <Trans id="Guestbook"></Trans>
  if (link.pathname === '/tags') title = <Trans id="Tags"></Trans>
  if (link.pathname === '/about') title = <Trans id="About"></Trans>

  return (
    <Link
      key={link.pathname}
      href={link.pathname}
      className={cn(
        'hover:text-brand dark:hover:text-brand/80 text-foreground/90 flex shrink-0 justify-center text-base leading-none',
        className,
      )}
    >
      {title}
    </Link>
  )
}
