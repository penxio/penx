import { Link } from '@/lib/i18n'
import { Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'

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

      {site.spaceId && (
        <Link
          href="/membership"
          className={cn(
            'hover:text-brand text-foreground/90 font-medium',
            'border-brand text-brand hover:bg-brand hover:text-background rounded-full border px-2 py-1 text-sm',
          )}
        >
          Membership
        </Link>
      )}
    </div>
  )
}
