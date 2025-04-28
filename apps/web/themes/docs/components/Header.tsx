import { Profile } from '@penx/components/Profile'
import { MobileSidebarSheet } from '@penx/components/MobileSidebarSheet'
import { Navigation } from '@penx/components/Navigation'
import { SocialNav } from '@penx/components/SocialNav'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import { Link } from '@penx/libs/i18n'
import { Site } from '@penx/types'
import { cn, getUrl } from '@penx/utils'
import { Sidebar } from './Sidebar'

interface Props {
  site: Site
}

export const Header = ({ site }: Props) => {
  return (
    <header
      className={cn(
        'border-foreground/5 sticky top-0 z-40 flex h-16 w-full items-center gap-2 border-b px-4 py-4 xl:px-0',
      )}
    >
      <MobileSidebarSheet site={site}>
        <Sidebar site={site} height="auto" />
      </MobileSidebarSheet>

      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <div className="flex items-center space-x-6 leading-5 sm:space-x-6">
          <Link href="/" className="flex items-center gap-2 px-0 py-3">
            {/* <Avatar className="h-8 w-8 border">
              <AvatarImage src={getUrl(site.logo || '')} />
              <AvatarFallback>{site.name.slice(0, 1)}</AvatarFallback>
            </Avatar> */}
            <div className="text-lg font-bold">{site.name}</div>
          </Link>
          <Navigation site={site} />
        </div>
        <div className="item-center flex gap-2">
          <div className="flex items-center">
            <SocialNav site={site} />
          </div>
          <Profile></Profile>
        </div>
      </div>
    </header>
  )
}
