import { Profile } from '@/components/Profile/Profile'
import { MobileSidebarSheet } from '@/components/theme-ui/MobileSidebar'
import { Navigation } from '@/components/theme-ui/Navigation'
import { Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'

interface Props {
  site: Site
}

export const Header = ({ site }: Props) => {
  return (
    <header
      className={cn('z-40 flex h-16 w-full items-center justify-between py-4')}
    >
      <MobileSidebarSheet site={site} />
      <Navigation site={site} />

      <div className="item-center flex gap-2">
        <Profile></Profile>
      </div>
    </header>
  )
}
