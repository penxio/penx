'use client'

import { useLoginDialog } from '@/components/LoginDialog/useLoginDialog'
import { useSession } from '@/components/session'
import { Button } from '@/components/ui/button'
import { useRouter } from '@/lib/i18n'
import { Trans } from '@lingui/react/macro'

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
          <Trans>Browser extension</Trans>
        </div>
        {/* <div className="absolute top-0 right-0 text-xs bg-yellow-500 px-1 py-[1px] rounded-bl-lg text-white">
          Beta now
        </div> */}
      </Button>
    </div>
  )
}
