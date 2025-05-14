'use client'

import { ReactNode } from 'react'
import { Trans } from '@lingui/react'
import { toast } from 'sonner'
import { useRouter } from '@penx/libs/i18n'
import { useSession } from '@penx/session'
import { Button, ButtonProps } from '@penx/uikit/button'
import { cn } from '@penx/utils'
import { useLoginDialog } from '@penx/widgets/useLoginDialog'

interface LaunchButtonProps extends ButtonProps {
  children?: ReactNode
  platform?: 'web' | 'ios' | 'android' | 'desktop'
}
export function LaunchButton({
  children,
  className,
  onClick,
  platform,
  ...rest
}: LaunchButtonProps) {
  return (
    <Button
      variant="outline-solid"
      size="lg"
      className={cn(
        'relative flex h-14 w-full items-center gap-2 text-base md:w-52',
        className,
      )}
      // variant="outline-solid"
      // variant="brand"
      {...rest}
      onClick={(e) => {
        onClick?.(e)
        if (platform === 'ios') {
          toast.info(
            'coming soon, you can contact maker in Discord and  join TestFlight ',
          )
        }
      }}
    >
      {children ? children : 'Web App;'}
    </Button>
  )
}
