'use client'

import { Button } from '@penx/ui/components/button'
import { Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import { Trans } from '@lingui/react/macro'
import { Mail } from 'lucide-react'
import { SubscribeNewsletterDialog } from './SubscribeNewsletterDialog'
import { useSubscribeNewsletterDialog } from './useSubscribeNewsletterDialog'

interface Props {
  className?: string
  site: Site
}

export function SubscribeNewsletterCard({ site, className }: Props) {
  const { setIsOpen } = useSubscribeNewsletterDialog()

  return (
    <>
      <SubscribeNewsletterDialog site={site} />
      <div
        className={cn(
          'mx-auto mt-8 flex flex-col items-center gap-4',
          className,
        )}
      >
        <div className="text-2xl font-bold">
          <Trans>Subscribe to</Trans> {site.name}
        </div>
        <Button
          className="flex w-40 items-center gap-2"
          onClick={() => setIsOpen(true)}
        >
          <Mail size={16} className="opacity-70" />
          <span>
            <Trans>Subscribe</Trans>
          </span>
        </Button>
      </div>
    </>
  )
}
