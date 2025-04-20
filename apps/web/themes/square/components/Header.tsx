import { Profile } from '@penx/components/Profile/Profile'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/ui/avatar'
import { Button } from '@penx/uikit/ui/button'
import { Link } from '@penx/libs/i18n'
import { Site } from '@penx/types'
import { cn, getUrl } from '@penx/utils'
import { PenToolIcon } from 'lucide-react'
import { Merienda } from 'next/font/google'
import { CreatePostButton } from './CreatePostButton'
import { Nav } from './Nav'

const merienda = Merienda({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

interface Props {
  site: Site
  className?: string
}

export const Header = ({ site, className }: Props) => {
  return (
    <header className={cn('bg-background z-40', className)}>
      <div
        className={cn('flex h-16 w-full items-center justify-center px-3 py-4')}
      >
        <div className="flex w-40 items-center justify-start">
          <Link
            href="/"
            aria-label={site.name}
            className="flex items-center justify-between gap-2"
          >
            <Avatar className="h-8 w-8 border">
              <AvatarImage src={getUrl(site.logo || '')} />
              <AvatarFallback>{site.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center gap-3">
          <div className={cn('text-2xl font-semibold', merienda.className)}>
            {site.name}
          </div>
          <div className="text-foreground/40">{site.description}</div>
        </div>

        <div className="flex w-40 items-center justify-end gap-1">
          <CreatePostButton />
          <Profile appearance="icon"></Profile>
        </div>
      </div>
      <Nav site={site} />
    </header>
  )
}
