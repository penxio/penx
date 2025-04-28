import { Profile } from '@penx/components/Profile'
import { MobileSidebarSheet } from '@penx/components/MobileSidebarSheet'
import { Navigation } from '@penx/components/Navigation'
import { Link } from '@penx/libs/i18n'
import { Site } from '@penx/types'
import { cn } from '@penx/utils'

interface Props {
  site: Site
}

export const Header = ({ site }: Props) => {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex h-12 items-center justify-between px-4 py-4',
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

      <div className="item-center flex w-40 justify-end gap-2 md:w-60">
        <Profile></Profile>
      </div>
    </header>
  )
}
