'use client'

import { cn, withRef } from '@udecode/cn'
import {
  useToggleButton,
  useToggleButtonState,
} from '@udecode/plate-toggle/react'
import { PlateElement, useElement } from '@udecode/plate/react'
import { ChevronRight } from 'lucide-react'
import { Button } from './button'

export const ToggleElement = withRef<typeof PlateElement>(
  ({ children, className, ...props }, ref) => {
    const element = useElement()
    const state = useToggleButtonState(element.id as string)
    const { buttonProps, open } = useToggleButton(state)

    return (
      <PlateElement ref={ref} className={cn(className, 'pl-6')} {...props}>
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground hover:bg-accent absolute -left-0.5 top-0 size-6 cursor-pointer select-none items-center justify-center rounded-md p-px transition-colors [&_svg]:size-4"
          contentEditable={false}
          {...buttonProps}
        >
          <ChevronRight
            className={cn(
              'transition-transform duration-75',
              open ? 'rotate-90' : 'rotate-0',
            )}
          />
        </Button>
        {children}
      </PlateElement>
    )
  },
)
