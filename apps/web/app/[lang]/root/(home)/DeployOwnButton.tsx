'use client'

import { Trans } from '@lingui/react'
import { Link, useRouter } from '@penx/libs/i18n'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/button'
import { useLoginDialog } from '@penx/widgets/LoginDialog/useLoginDialog'

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
          <Trans id="Deploy my own"></Trans>
        </div>
        {/* <div className="absolute top-0 right-0 text-xs bg-emerald-500 px-1 py-[] rounded-bl-lg text-white">
        <Trans id="Recommend"></Trans>
          
        </div> */}
      </Link>
    </Button>
  )
}
