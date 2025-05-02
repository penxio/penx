import { Merienda } from 'next/font/google'
import { Profile } from '@penx/components/Profile'
import { Link } from '@penx/libs/i18n'
import { Site } from '@penx/types'
import { cn } from '@penx/utils'
import { Nav } from './Nav'

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
    <header className="z-40">
      <div
        className={cn(
          'flex h-16 w-full items-center justify-center px-0 py-4 sm:px-4',
        )}
      >
        <div className="hidden flex-1 md:block"></div>
        <div className="flex flex-1 items-center justify-start md:justify-center">
          <Link href="/" aria-label={site.name}>
            <div className="flex items-center justify-between">
              <div
                className={cn('h-6 text-2xl font-semibold', merienda.className)}
              >
                {site.name}
              </div>
            </div>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="no-scrollbar hidden items-center space-x-4 overflow-x-auto sm:flex sm:space-x-6">
            {headerNavLinksRight.map((link) => {
              return (
                <Link
                  key={link.title}
                  href={link.href}
                  className="hover:text-brand text-foreground/90  font-medium"
                >
                  {link.title}
                </Link>
              )
            })}
          </div>

          <Profile></Profile>
        </div>
      </div>
      <Nav site={site} />
    </header>
  )
}
