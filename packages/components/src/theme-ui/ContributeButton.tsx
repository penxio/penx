'use client'

import { Trans } from '@lingui/react'
import { usePathname } from 'next/navigation'
import { Link } from '@penx/libs/i18n'
import { useSession } from '@penx/session'
import { Site } from '@penx/types'
import { useLoginDialog } from '@penx/widgets/useLoginDialog'

interface Props {
  site: Site
  className?: string
}

export function ContributeButton({ site, className }: Props) {
  const isCanContribute = site.config?.features?.contribute ?? false
  const { session } = useSession()
  const { setIsOpen } = useLoginDialog()
  const pathname = usePathname()

  if (!isCanContribute) return null

  return (
    <div className="flex items-center">
      <Link
        href={`/contribute?source=${pathname}`}
        className="bg-brand/80 hover:bg-brand text-background rounded-full px-2 py-1 text-xs transition-all hover:scale-105"
        onClick={(e) => {
          if (!session) {
            e.preventDefault()
            setIsOpen(true)
          }
        }}
      >
        <Trans id="Contribute"></Trans>
      </Link>
    </div>
  )
}
