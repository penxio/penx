import { Profile } from '@/components/Profile/Profile'
import { MobileSidebarSheet } from '@/components/theme-ui/MobileSidebar'
import { Navigation } from '@/components/theme-ui/Navigation'
import { Link } from '@/lib/i18n'
import { Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import { Merienda } from 'next/font/google'

const merienda = Merienda({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

const headerNavLinksRight = [{ href: '/creator-fi', title: 'CreatorFi' }]

interface Props {
  site: Site
}

export const Header = ({ site }: Props) => {
  return (
    <header
      className={cn(
        'z-40 flex h-16 w-full items-center justify-between gap-2 py-4',
      )}
    >
      <MobileSidebarSheet site={site} />
      <Navigation site={site} className="w-80" />
      <div className="flex w-80 items-center justify-end gap-4">
        <div className="flex items-center space-x-4 sm:space-x-6">
          {headerNavLinksRight.map((link) => {
            if (link.href === '/creator-fi' && !site.spaceId) {
              return null
            }
            return (
              <Link
                key={link.title}
                href={link.href}
                className="hover:text-brand dark:hover:text-brand/80 text-foreground/90 font-medium"
              >
                {link.title}
              </Link>
            )
          })}
        </div>

        <Profile></Profile>
      </div>
    </header>
  )
}
