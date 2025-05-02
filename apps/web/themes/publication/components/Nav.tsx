import { Link } from '@penx/libs/i18n'
import { Site } from '@penx/types'
import { cn } from '@penx/utils'

interface Props {
  site: Site
}

export const Nav = ({ site }: Props) => {
  return (
    <div className="border-foreground/5 flex h-12 items-center justify-center space-x-4 overflow-x-auto border-b border-t sm:flex sm:space-x-6">
      {site.navLinks.map((link) => {
        if (!link.visible) return null
        return (
          <Link
            key={link.title}
            href={link.pathname}
            className={cn(
              'hover:text-brand dark:hover:text-brand/80 text-foreground/90 font-medium',
            )}
          >
            {link.title}
          </Link>
        )
      })}
    </div>
  )
}
