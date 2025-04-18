import React, { FC, forwardRef, PropsWithChildren, ReactNode } from 'react'

export interface MenuGroupProps {
  title: ReactNode
}

export const MenuGroup = forwardRef<
  HTMLDivElement,
  PropsWithChildren<MenuGroupProps>
>(function MenuGroup(props, ref) {
  const { title, children, ...rest } = props
  return (
    <div className="uikit-menu-group" ref={ref} {...rest}>
      <div className="text-foreground/50 flex max-h-8 items-center px-4 text-xs">
        {title}
      </div>
      {children}
    </div>
  )
})
