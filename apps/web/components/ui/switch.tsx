'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import * as SwitchPrimitives from '@radix-ui/react-switch'

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
    size?: 'sm' | 'md' | 'lg'
  }
>(({ className, size = 'md', ...props }, ref) => {
  const rootClassName = React.useMemo(() => {
    if (size === 'sm') return 'h-4 w-6'
    return 'h-6 w-11 '
  }, [size])
  const thumbClassName = React.useMemo(() => {
    if (size === 'sm') {
      return 'h-3 w-3 data-[state=checked]:translate-x-2'
    }
    return 'h-5 w-5 data-[state=checked]:translate-x-5'
  }, [size])
  return (
    <SwitchPrimitives.Root
      className={cn(
        'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
        rootClassName,
        className,
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          'pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0',
          thumbClassName,
        )}
      />
    </SwitchPrimitives.Root>
  )
})
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
