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
  const [open, setOpen] = useState(false)

  if (!session?.isFree) return null

  return (
    <>
      <div
        className={cn(
          'flex h-full w-full items-center justify-between',
          className,
        )}
        onClick={() => {
          setOpen(!open)
        }}
      >
        <div className="font-medium">
          <Trans>Subscription</Trans>
        </div>
        <div>
          <ChevronRightIcon className="text-foreground/50" />
        </div>
      </div>

      <Drawer open={open} setOpen={setOpen} isFullHeight className="">
        <UpgradeContent
          onSubscribeSuccess={() => {
            setOpen(false)
          }}
        />
      </Drawer>
    </>
  )
}
