'use client'

import { Trans } from '@lingui/react'
import { Mail } from 'lucide-react'
import { Site } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { cn } from '@penx/utils'
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
          <Trans id="Subscribe to"></Trans> {site.name}
        </div>
        <Button
          className="flex w-40 items-center gap-2"
          onClick={() => setIsOpen(true)}
        >
          <Mail size={16} className="opacity-70" />
          <span>
            <Trans id="Subscribe"></Trans>
          </span>
        </Button>
      </div>
    </>
  )
}
