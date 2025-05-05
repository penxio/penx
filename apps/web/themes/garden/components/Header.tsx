import { MobileSidebarSheet } from '@penx/components/MobileSidebarSheet'
import { Navigation } from '@penx/components/Navigation'
import { Profile } from '@penx/components/Profile'
import { Link } from '@penx/libs/i18n'
import { Site } from '@penx/types'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import { cn } from '@penx/utils'

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
      {/* <MobileSidebarSheet
        site={site}
        logo={
          <Link
            href="/"
            className="w-auto cursor-pointer text-xl font-bold md:w-60"
          >
            {site.name}
          </Link>
        }
      /> */}

      <div className="item-center flex w-auto gap-2 md:w-40">
        <Avatar className="size-8">
          <AvatarImage src={site.logo || ''} />
          <AvatarFallback>{site?.name.slice(0, 1)}</AvatarFallback>
        </Avatar>
      </div>

      <Link
        href="/"
        className="w-auto cursor-pointer text-lg font-bold md:inline-flex md:w-60"
      >
        {site.name}
      </Link>

      {/* <Navigation site={site} /> */}

      <div className="item-center flex w-auto justify-end gap-2 md:w-40">
        <Profile></Profile>
      </div>
    </header>
  )
}
