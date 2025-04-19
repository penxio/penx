import { ReactNode } from 'react'
import { ModeToggle } from '@/components/ModeToggle'
import { Profile } from '@/components/Profile/Profile'
import { MembershipEntry } from '@/components/theme-ui/MembershipEntry'
import { SocialNav } from '@/components/theme-ui/SocialNav'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/ui/avatar'
import { Link } from '@/lib/i18n'
import { Site, Tag } from '@penx/types'
import { cn, getUrl } from '@penx/utils'
import { Trans } from '@lingui/react/macro'
import { slug } from 'github-slugger'

interface Props {
  site: Site
  tags: Tag[]
}

export const Sidebar = ({ site, tags }: Props) => {
  const links = [
    ...site?.navLinks,
    {
      pathname: '/creator-fi',
      title: 'CreatorFi',
      visible: true,
    },
  ]
  return (
    <aside
      className="sidebar sticky top-0 hidden w-52 shrink-0 flex-col overflow-y-auto pb-4 pl-8 pr-2 md:flex"
      style={{
        height: 'calc(100vh)',
      }}
    >
      <div className="flex w-full flex-1 flex-col space-y-6">
        <Link href="/" className="flex items-center gap-2 px-0 py-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={getUrl(site.logo || '')} />
            <AvatarFallback>{site.name.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div className="text-lg font-bold">{site.name}</div>
        </Link>
        <div className="flex flex-1 flex-col justify-center">
          <div className="-mt-40 space-y-8">
            <div className="flex flex-col space-y-3">
              {links.map((link) => {
                if (link.pathname === '/creator-fi' && !site.spaceId) {
                  return null
                }

                if (!link.visible) return null

                let title = link.title as ReactNode
                if (link.pathname === '/') title = <Trans>Home</Trans>
                if (link.pathname === '/posts') title = <Trans>Posts</Trans>
                if (link.pathname === '/writings')
                  title = <Trans>Writings</Trans>
                if (link.pathname === '/podcasts')
                  title = <Trans>Podcasts</Trans>
                if (link.pathname === '/notes') title = <Trans>Notes</Trans>
                if (link.pathname === '/areas') title = <Trans>Areas</Trans>
                if (link.pathname === '/projects')
                  title = <Trans>Projects</Trans>
                if (link.pathname === '/friends') title = <Trans>Friends</Trans>
                if (link.pathname === '/ama') title = <Trans>AMA</Trans>
                if (link.pathname === '/guestbook')
                  title = <Trans>Guestbook</Trans>
                if (link.pathname === '/tags') title = <Trans>Tags</Trans>
                if (link.pathname === '/about') title = <Trans>About</Trans>

                return (
                  <Link
                    key={link.pathname}
                    href={link.pathname}
                    className={cn(
                      'hover:text-brand dark:hover:text-brand/80 text-foreground/80 text-sm font-medium transition-all hover:scale-105',
                    )}
                  >
                    {link.title}
                  </Link>
                )
              })}
            </div>

            <div className="space-y-2">
              <div className="font-medium">Tags</div>
              <ul className="flex flex-col gap-1">
                {tags.map((t) => {
                  return (
                    <li key={t.id} className="">
                      <Link
                        href={`/tags/${slug(t.name)}`}
                        className="text-foreground/60 hover:text-brand dark:hover:text-brand rounded-full py-0 transition-all hover:scale-105"
                        aria-label={`View posts tagged ${t.name}`}
                      >
                        #{`${t.name}`}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="mt-auto flex flex-col gap-2">
              <Profile
                buttonProps={{
                  // variant: 'default',
                  variant: 'outline-solid',
                  size: 'xs',
                  className: 'w-16',
                }}
              />
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {site.products.length > 0 && (
            <div>
              <MembershipEntry className="inline-flex" />
            </div>
          )}
          <div className="flex items-center justify-between">
            <SocialNav className="" site={site} size={4} />
            <ModeToggle
              variant="outline"
              className="fixed right-3 top-3 h-7 w-7"
            />
          </div>
        </div>
      </div>
    </aside>
  )
}
