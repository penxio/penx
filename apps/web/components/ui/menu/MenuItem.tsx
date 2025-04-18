import React, {
  DOMAttributes,
  FC,
  forwardRef,
  HTMLAttributes,
  PropsWithChildren,
} from 'react'
import { cn } from '@/lib/utils'
import { useMenuContext } from './context'

export interface MenuItemProps extends PropsWithChildren<HTMLAttributes<any>> {
  selected?: boolean
  disabled?: boolean
  className?: string
}

export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
  function MenuItem(props, ref) {
    const { selected, disabled, children, className, ...rest } = props

    return (
      <div
        ref={ref}
        className={cn(
          'bg-background text-foreground flex flex-row items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
          disabled && 'bg-foreground/5 cursor-not-allowed opacity-40',
          !disabled && 'cursor-pointer',
          !disabled && !selected && 'hover:bg-foreground/5',
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    )
  },
)
