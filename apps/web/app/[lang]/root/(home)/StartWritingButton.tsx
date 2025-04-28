'use client'

import { Trans } from '@lingui/react'
import { useRouter } from '@penx/libs/i18n'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/button'
import { useLoginDialog } from '@penx/widgets/LoginDialog/useLoginDialog'

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
          <Trans id="Start writing"></Trans>
        </div>
        {/* <div className="absolute top-0 right-0 text-xs bg-yellow-500 px-1 py-[1px] rounded-bl-lg text-white">
          Beta now
        </div> */}
      </Button>
    </div>
  )
}
