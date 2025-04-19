'use client'

import { useLoginDialog } from '@/components/LoginDialog/useLoginDialog'
import { useSession } from '@/components/session'
import { Button } from '@penx/uikit/ui/button'
import { Link, useRouter } from '@/lib/i18n'
import { Trans } from '@lingui/react/macro'

export function DeployOwnButton() {
  const { data } = useSession()
  const { setIsOpen } = useLoginDialog()
  const { push } = useRouter()
  return (
    <Button
      size="lg"
      className="relative flex h-14 w-52 flex-col overflow-hidden text-base"
      asChild
    >
      <Link href="/self-hosted" className="overflow-hidden">
        <div>
          <Trans>Deploy my own</Trans>
        </div>
        {/* <div className="absolute top-0 right-0 text-xs bg-emerald-500 px-1 py-[] rounded-bl-lg text-white">
        <Trans>Recommend</Trans>
          
        </div> */}
      </Link>
    </Button>
  )
}
