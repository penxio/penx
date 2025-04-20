'use client'

import { Link } from '@/lib/i18n'
import { cn } from '@penx/utils'
import { Trans, useLingui } from '@lingui/react/macro'
import { usePathname } from 'next/navigation'

interface Props {
  className?: string
}
export function MembershipEntry({ className }: Props) {
  const pathname = usePathname()
  const { i18n } = useLingui()
  const isCN = ['zh-CN', 'zh-TW'].includes(i18n.locale)

  return (
    <Link
      href={`/subscribe?source=${pathname}`}
      className={cn(
        'hover:text-brand text-foreground/90 font-medium',
        'border-brand text-brand hover:bg-brand hover:text-background rounded-full border px-2 py-1 text-sm',
        isCN && 'py-1',
        className,
      )}
    >
      {isCN ? '成为会员' : <Trans>Membership</Trans>}
    </Link>
  )
}
