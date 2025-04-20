import { ReactNode } from 'react'
import { Link } from '@/lib/i18n'
import { NavLink } from '@penx/types'
import { cn } from '@penx/utils'
import { Trans } from '@lingui/react/macro'

interface Props {
  link: NavLink
  className?: string
}

export function NavigationItem({ link, className }: Props) {
  let title = link.title as ReactNode
  if (link.pathname === '/') title = <Trans>Home</Trans>
  if (link.pathname === '/posts') title = <Trans>Posts</Trans>
  if (link.pathname === '/writings') title = <Trans>Writings</Trans>
  if (link.pathname === '/podcasts') title = <Trans>Podcasts</Trans>
  if (link.pathname === '/notes') title = <Trans>Notes</Trans>
  if (link.pathname === '/areas') title = <Trans>Areas</Trans>
  if (link.pathname === '/projects') title = <Trans>Projects</Trans>
  if (link.pathname === '/friends') title = <Trans>Friends</Trans>
  if (link.pathname === '/ama') title = <Trans>AMA</Trans>
  if (link.pathname === '/guestbook') title = <Trans>Guestbook</Trans>
  if (link.pathname === '/tags') title = <Trans>Tags</Trans>
  if (link.pathname === '/about') title = <Trans>About</Trans>

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
