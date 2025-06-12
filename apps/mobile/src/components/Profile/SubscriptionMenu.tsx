import { ReactNode, useState } from 'react'
import { Trans, useLingui } from '@lingui/react/macro'
import { ChevronRightIcon } from 'lucide-react'
import { useSession } from '@penx/session'
import { cn } from '@penx/utils'
import { Drawer } from '../ui/Drawer'
import { UpgradeContent } from '../UpgradeDrawer/UpgradeContent'

interface ItemProps {
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}

export function SubscriptionMenu({ children, className }: ItemProps) {
  const { session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  if (!session?.isFree) return null

  return (
    <>
      <div
        className={cn(
          'border-foreground/5 text-foreground flex items-center justify-between border-b py-2',
          className,
        )}
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        <div className="font-medium">
          <Trans>Subscription</Trans>
        </div>
        <div>
          <ChevronRightIcon className="text-foreground/50" />
        </div>
      </div>

      <Drawer open={isOpen} setOpen={setIsOpen} isFullHeight className="">
        <UpgradeContent
          onSubscribeSuccess={() => {
            setIsOpen(false)
          }}
        />
      </Drawer>
    </>
  )
}
