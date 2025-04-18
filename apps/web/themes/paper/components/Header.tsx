import { Profile } from '@/components/Profile/Profile'
import { MobileSidebarSheet } from '@/components/theme-ui/MobileSidebar'
import { Navigation } from '@/components/theme-ui/Navigation'
import { Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'

interface Props {
  site: Site
  className?: string
}

export const Header = ({ site, className }: Props) => {
  return (
    <header className="-mx-4 sm:-mx-10">
      <div className="item-center flex justify-between gap-2 p-4">
        <div>
          <MobileSidebarSheet site={site} />
        </div>
        <Profile></Profile>
      </div>
      <div className="flex flex-col items-center px-10 pb-10 pt-2">
        <h1 className="text-center text-3xl font-bold">{site.name}</h1>
        <div className="text-foreground/70 text-center">{site.description}</div>
      </div>
      <div
        className={cn(
          'border-foreground/5 z-40 hidden h-12 w-full items-center justify-center border-b border-t py-4 md:flex',
          className,
        )}
      >
        <Navigation site={site} />
      </div>
    </header>
  )
}
