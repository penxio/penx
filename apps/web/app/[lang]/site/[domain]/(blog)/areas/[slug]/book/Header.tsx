import { Profile } from '@/components/Profile/Profile'
import { MobileSidebarSheet } from '@/components/theme-ui/MobileSidebar/MobileSidebarSheet'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/ui/components/avatar'
import { Link } from '@/lib/i18n'
import { AreaWithCreations, Site } from '@/lib/theme.types'
import { cn, getUrl } from '@/lib/utils'
import { Sidebar } from './Sidebar'

interface Props {
  area: AreaWithCreations
  site: Site
}

export const Header = ({ site, area }: Props) => {
  return (
    <header
      className={cn(
        'border-foreground/5 sticky top-0 z-40 flex h-16 w-full items-center gap-2 border-b px-4 py-4 xl:px-0',
      )}
    >
      <MobileSidebarSheet site={site}>
        <Sidebar site={site} area={area} height="auto" />
      </MobileSidebarSheet>

      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <div className="flex items-center space-x-6 leading-5 sm:space-x-6">
          <Link href="/" className="flex items-center gap-2 px-0 py-3">
            <Avatar className="h-8 w-8 border">
              <AvatarImage src={getUrl(area.logo || '')} />
              <AvatarFallback>{area.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div className="text-lg font-bold">{area.name}</div>
          </Link>
        </div>
        <div className="item-center flex gap-2">
          <Profile></Profile>
        </div>
      </div>
    </header>
  )
}
