import { Merienda } from 'next/font/google'
import { MobileSidebarSheet } from '@penx/components/MobileSidebarSheet'
import { Navigation } from '@penx/components/Navigation'
import { Profile } from '@penx/components/Profile'
import { Link } from '@penx/libs/i18n'
import { Site } from '@penx/types'
import { cn } from '@penx/utils'

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
