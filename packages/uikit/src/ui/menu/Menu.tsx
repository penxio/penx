import React, { FC, forwardRef, PropsWithChildren } from 'react'
import { cn } from '@penx/utils'
import { MenuContext, MenuProvider } from './context'

export interface MenuProps extends MenuContext, PropsWithChildren {
  className?: string
}

export const Menu = forwardRef<HTMLDivElement, MenuProps>(function MenuProps(
  props: MenuProps,
  ref,
) {
  const { colorScheme = 'brand500', className, ...rest } = props
  return (
    <MenuProvider value={{ colorScheme }}>
      <div
        className={cn(
          'uikit-menu bg-background min-w-[140xp] overflow-hidden rounded shadow',
          className,
        )}
        ref={ref}
        {...rest}
      />
    </MenuProvider>
  )
})
