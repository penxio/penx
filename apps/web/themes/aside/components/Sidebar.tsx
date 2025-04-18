import { ModeToggle } from '@/components/ModeToggle'
import { Profile } from '@/components/Profile/Profile'
import { MembershipEntry } from '@/components/theme-ui/MembershipEntry'
import { NavigationItem } from '@/components/theme-ui/NavigationItem'
import { SocialNav } from '@/components/theme-ui/SocialNav'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link } from '@/lib/i18n'
import { NavLink, Site, Tag } from '@/lib/theme.types'
import { cn, getUrl } from '@/lib/utils'
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
  ] as NavLink[]
  return (
    <aside
      className="sidebar sticky top-0 hidden w-64 shrink-0 flex-col overflow-y-auto pb-4 pr-2 pt-24 md:flex"
      style={{
        height: 'calc(100vh)',
      }}
    >
      <div className="flex w-full flex-1 flex-col space-y-6">
        <div>
          <Link href="/" className="flex flex-col gap-2 px-0 py-2">
            {/* <Avatar className="h-32 w-32 rounded-2xl">
              <AvatarImage src={getUrl(site.logo || '')} />
              <AvatarFallback>{site.name.slice(0, 1)}</AvatarFallback>
            </Avatar> */}
            <div className="text-3xl font-bold">{site.name}</div>
          </Link>
          <div className="text-foreground/60 text-lg font-light">
            {site.description}
          </div>
        </div>
        {site.products.length > 0 && (
          <div>
            <MembershipEntry className="px-3 py-1.5" />
          </div>
        )}

        <SocialNav className="" site={site} size={4} />
        <div className="flex flex-col gap-3">
          {links.map((link) => {
            if (link.pathname === '/creator-fi' && !site.spaceId) {
              return null
            }

            if (!link.visible) return null

            return (
              <div key={link.pathname}>
                <NavigationItem
                  link={link}
                  className="inline-flex justify-start font-medium"
                />
              </div>
            )
          })}

          {site.spaceId && (
            <Link
              href="/membership"
              className={cn(
                'hover:text-brand text-foreground/90 font-medium',
                'border-brand text-brand hover:bg-brand hover:text-background rounded-full border px-2 py-1 text-sm',
              )}
            >
              <Trans>Membership</Trans>
            </Link>
          )}
        </div>

        {!!tags.length && (
          <div className="space-y-2">
            <div className="font-semibold">
              <Trans>Tags</Trans>
            </div>
            <ul className="flex flex-col gap-1">
              {tags.map((t) => {
                return (
                  <li key={t.id} className="">
                    <Link
                      href={`/tags/${slug(t.name)}`}
                      className="text-foreground/60 hover:text-brand dark:hover:text-brand rounded-full py-0 text-right"
                      aria-label={`View posts tagged ${t.name}`}
                    >
                      #{`${t.name}`}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
      <div className="mt-auto flex items-center justify-between gap-2">
        <Profile
          buttonProps={{
            size: 'sm',
            variant: 'outline',
            className: 'w-20',
          }}
        />
      </div>
    </aside>
  )
}
