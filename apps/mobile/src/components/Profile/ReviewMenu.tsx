import { AppReview } from '@capawesome/capacitor-app-review'
import { Trans } from '@lingui/react/macro'
import { ChevronRightIcon } from 'lucide-react'
import { cn } from '@penx/utils'

interface ItemProps {
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}

export function ReviewMenu({ children, className }: ItemProps) {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-between',
        className,
      )}
      onClick={async () => {
        await AppReview.openAppStore({
          appId: '6745962671',
        })
        // await AppReview.requestReview()
      }}
    >
      <div className="font-medium">
        <Trans>Leave a review</Trans>
      </div>
      <div>
        <ChevronRightIcon className="text-foreground/50" />
      </div>
    </div>
  )
}
