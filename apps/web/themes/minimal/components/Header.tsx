import { Profile } from '@penx/components/Profile/Profile'
import { MobileSidebarSheet } from '@penx/components/theme-ui/MobileSidebar/MobileSidebarSheet'
import { Navigation } from '@penx/components/theme-ui/Navigation'
import { Site } from '@penx/types'
import { cn } from '@penx/utils'

interface Props {
  site: Site
  className?: string
}

export const Header = ({ site, className }: Props) => {
  return (
    <header
      className={cn(
        'z-40 flex h-16 w-full items-center justify-between py-4',
        className,
      )}
    >
      <MobileSidebarSheet site={site} />
      <Navigation site={site} />

      <div className="item-center flex gap-2">
        <Profile></Profile>
      </div>
    </header>
  )
}
