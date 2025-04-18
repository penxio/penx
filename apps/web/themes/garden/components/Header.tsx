import { Profile } from '@/components/Profile/Profile'
import { MobileSidebarSheet } from '@/components/theme-ui/MobileSidebar'
import { Navigation } from '@/components/theme-ui/Navigation'
import { Link } from '@/lib/i18n'
import { Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'

interface Props {
  site: Site
}

export const Header = ({ site }: Props) => {
  return (
    <header
      className={cn(
        'bg-background/60 sticky top-0 z-40 flex h-12 items-center justify-between px-4 py-4',
      )}
    >
      <MobileSidebarSheet
        site={site}
        logo={
          <Link
            href="/"
            className="w-auto cursor-pointer text-xl font-bold md:w-60"
          >
            {site.name}
          </Link>
        }
      />

      <Link
        href="/"
        className="hidden w-auto cursor-pointer text-xl font-bold md:inline-flex md:w-60"
      >
        {site.name}
      </Link>

      <Navigation site={site} />

      <div className="item-center flex w-40 justify-end gap-2 md:w-60">
        <Profile></Profile>
      </div>
    </header>
  )
}
