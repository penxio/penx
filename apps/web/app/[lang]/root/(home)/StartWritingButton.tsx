'use client'

import { useLoginDialog } from '@/components/LoginDialog/useLoginDialog'
import { useSession } from '@/components/session'
import { Button } from '@penx/uikit/ui/button'
import { useRouter } from '@/lib/i18n'
import { Trans } from '@lingui/react/macro'

export function StartWritingButton() {
  const { data } = useSession()
  const { setIsOpen } = useLoginDialog()
  const { push } = useRouter()
  return (
    <div className="relative flex flex-col gap-1">
      <Button
        size="lg"
        className="relative h-14 w-52 overflow-hidden text-base"
        // variant="outline-solid"
        // variant="brand"
        onClick={() => {
          if (data) {
            push('/~')
          } else {
            setIsOpen(true)
          }
        }}
      >
        <div>
          <Trans>Start writing</Trans>
        </div>
        {/* <div className="absolute top-0 right-0 text-xs bg-yellow-500 px-1 py-[1px] rounded-bl-lg text-white">
          Beta now
        </div> */}
      </Button>
    </div>
  )
}
