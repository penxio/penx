'use client'

import { ReactNode } from 'react'
import SocialIcon from '@/components/theme-ui/SocialIcon'
import { Link } from '@/lib/i18n'
import { cn } from '@penx/utils'
import { Trans } from '@lingui/react/macro'
import { ArrowUpRight, ExternalLink, Flame } from 'lucide-react'
import { toast } from 'sonner'

type NavItem = {
  text?: ReactNode
  icon?: ReactNode
  to: string
  isExternal?: boolean
  isToast?: boolean
}

export const Nav = () => {
  const navData: NavItem[] = [
    // {
    //   text: 'Marketplace',
    //   to: '/marketplace',
    // },

    // {
    //   text: 'Tokenomics',
    //   to: '/tokenomics',
    // },

    // {
    //   text: 'Sponsor',
    //   to: '/sponsor',
    // },
    {
      text: <Trans>About</Trans>,
      to: '/about',
    },
    // {
    //   text: <Trans>Themes</Trans>,
    //   to: '/themes',
    // },
    // {
    //   text: <Trans>Hosted</Trans>,
    //   to: '/self-hosted',
    // },
    {
      text: <Trans>Pricing</Trans>,
      to: '/pricing',
    },
    // {
    //   text: 'Rewards',
    //   to: '/rewards',
    // },
    // {
    //   text: 'Download',
    //   isExternal: true,
    //   to: 'https://github.com/penx-labs/penx-desktop/releases',
    // },
    {
      text: <Trans>Partner program</Trans>,
      to: '/partner-program',
    },
  ]

  return (
    <div className="hidden items-center gap-6 md:flex">
      {navData.map((item, i) => {
        if (item.isToast) {
          return (
            <div
              key={i}
              className="text-foreground/80 inline-flex cursor-pointer"
              onClick={() => {
                toast.success(
                  'Join PenX Discord and contact 0xZio in "Join this project" channel.',
                )
              }}
            >
              {item.text}
            </div>
          )
        }
        if (item.isExternal) {
          return (
            <div key={i}>
              <a
                href={item.to}
                target="_blank"
                className="text-foreground/80 flex items-center gap-1"
              >
                {item.text && <div>{item.text}</div>}
                {!!item.icon && item.icon}
                <div className="inline-flex">
                  <ArrowUpRight size={12} className="text-foreground/60" />
                </div>
              </a>
            </div>
          )
        }

        return (
          <div key={i}>
            <Link
              href={item.to}
              className={cn(
                'text-foreground/80 flex items-center gap-0',
                item.to === '/partner-program' && 'font-medium text-pink-500',
              )}
            >
              {item.to === '/partner-program' && (
                <span className="icon-[token--zap] size-6"></span>
              )}
              <span>{item.text}</span>
            </Link>
          </div>
        )
      })}
    </div>
  )
}
