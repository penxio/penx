'use client'

import * as React from 'react'
import { cn } from '@penx/utils'
import { useComposedRef } from '@udecode/cn'
import {
  flip,
  offset,
  useFloatingToolbar,
  useFloatingToolbarState,
  type FloatingToolbarState,
} from '@udecode/plate-floating'
import {
  useEditorId,
  useEventEditorValue,
  usePluginOption,
} from '@udecode/plate/react'
import { Toolbar } from './toolbar'

type FloatingToolbarProps = React.ComponentProps<typeof Toolbar> & {
  state?: FloatingToolbarState
}

export function FloatingToolbar({
  children,
  className,
  state,
  ...props
}: FloatingToolbarProps) {
  const editorId = useEditorId()
  const focusedEditorId = useEventEditorValue('focus')
  const isFloatingLinkOpen = !!usePluginOption({ key: 'a' }, 'mode')
  const isAIChatOpen = usePluginOption({ key: 'aiChat' }, 'open')

  const floatingToolbarState = useFloatingToolbarState({
    editorId,
    focusedEditorId,
    hideToolbar: isFloatingLinkOpen || isAIChatOpen,
    ...state,
    floatingOptions: {
      middleware: [
        offset(12),
        flip({
          fallbackPlacements: [
            'top-start',
            'top-end',
            'bottom-start',
            'bottom-end',
          ],
          padding: 12,
        }),
      ],
      placement: 'top',
      ...state?.floatingOptions,
    },
  })

  const {
    clickOutsideRef,
    hidden,
    props: rootProps,
    ref: floatingRef,
  } = useFloatingToolbar(floatingToolbarState)

  const ref = useComposedRef<HTMLDivElement>(props.ref, floatingRef)

  if (hidden) return null

  return (
    <div ref={clickOutsideRef}>
      <Toolbar
        {...props}
        {...rootProps}
        ref={ref}
        className={cn(
          'scrollbar-hide bg-popover absolute z-50 overflow-x-auto whitespace-nowrap rounded-md border p-1 opacity-100 shadow-md print:hidden',
          'max-w-[80vw]',
          className,
        )}
      >
        {children}
      </Toolbar>
    </div>
  )
}
