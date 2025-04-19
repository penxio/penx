'use client'

import { useSession } from '@/components/session'
import { Link } from '@/lib/i18n'
import { Site } from '@penx/types'
import { Trans } from '@lingui/react/macro'
import { usePathname } from 'next/navigation'
import { useLoginDialog } from '../LoginDialog/useLoginDialog'

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
        <Trans>Contribute</Trans>
      </Link>
    </div>
  )
}
