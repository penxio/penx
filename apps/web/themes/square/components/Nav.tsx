import { MembershipEntry } from '@penx/components/MembershipEntry'
import { Link } from '@penx/libs/i18n'
import { Site } from '@penx/types'
import { cn } from '@penx/utils'

interface Props {
  site: Site
}

export const Nav = ({ site }: Props) => {
  return (
    <div className="border-foreground/5 border-b-foreground/10 flex h-12 border-b border-t">
      <div className="mx-auto flex w-full justify-center lg:max-w-6xl">
        <div className="flex items-center gap-6">
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

          <div className="flex h-full items-center">
            <MembershipEntry className="px-3 py-1.5" />
          </div>
        </div>
      </div>
    </div>
  )
}
