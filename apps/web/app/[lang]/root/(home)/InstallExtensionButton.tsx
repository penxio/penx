'use client'

import { Trans } from '@lingui/react'
import { useRouter } from '@penx/libs/i18n'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/button'
import { useLoginDialog } from '@penx/widgets/useLoginDialog'

export function InstallExtensionButton() {
  const { data } = useSession()
  const { setIsOpen } = useLoginDialog()
  const { push } = useRouter()
  return (
    <div className="relative flex flex-col gap-1">
      <Button
        variant="outline-solid"
        size="lg"
        className="relative hidden h-14 w-52 text-base  md:block"
        // variant="outline-solid"
        // variant="brand"
        onClick={() => {
          window.open(
            'https://chromewebstore.google.com/detail/penx/nfdhmignelihijoaieicnmealildncen',
          )
        }}
      >
        <div>
          <Trans id="Browser extension"></Trans>
        </div>
        {/* <div className="absolute top-0 right-0 text-xs bg-yellow-500 px-1 py-[1px] rounded-bl-lg text-white">
          Beta now
        </div> */}
      </Button>
    </div>
  )
}
