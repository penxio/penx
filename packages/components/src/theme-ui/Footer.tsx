import { ModeToggle } from '@penx/components/ModeToggle'
import { Link } from '@penx/libs/i18n'
import { Site } from '@penx/types'
import { cn } from '@penx/utils'
import { ContributeButton } from './ContributeButton'
import { LangSwitcher } from './LangSwitcher'
import { SocialNav } from './SocialNav'

interface Props {
  site: Site
  className?: string
}

export function Footer({ site, className }: Props) {
  if (!site) return null
  return (
    <footer className={cn('mb-4 mt-auto', className)}>
      <div className="mt-16 flex flex-col items-center">
        <div className="item-center mb-3 flex space-x-4"></div>
        <SocialNav className="mb-3" site={site} />
        <div className="item-center text-foreground/50 mb-2 flex space-x-2 text-sm">
          <div className="flex items-center">{`© ${new Date().getFullYear()}`}</div>
          <div className="flex items-center">{` • `}</div>
          <div className="flex items-center">{site.name}</div>
          <div className="flex items-center">{` • `}</div>
          <div className="flex items-center gap-1">
            Build with
            <a href="https://penx.io" target="_blank" className="text-brand">
              PenX
            </a>
          </div>
          <div className="hidden items-center md:flex">{` • `}</div>
          <div className="hidden items-center md:flex">
            <Link href="/creations/feed.xml" target="_blank">
              RSS
            </Link>
          </div>

          <ModeToggle className="hidden md:flex" />
          <LangSwitcher className="hidden md:flex" site={site} />
          <ContributeButton site={site} />
        </div>
      </div>
    </footer>
  )
}
