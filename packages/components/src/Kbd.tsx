/**
 * ⌥ -> lef option
 * ⎇ -> right option
 * ⇧ -> shift
 * ⌘ -> command
 * ↵ -> enter
 * ⌃ -> control
 * ⌦ -> delete
 */

import { PropsWithChildren } from 'react'
import { cn } from '@penx/utils'

interface Props {
  className?: string
}

const map: Record<string, string> = {
  Control: '⌃',
  Meta: '⌘',
  Command: '⌘',
  Shift: '⇧',
  Alt: '⌥',

  ctrl: '⌃',
  meta: '⌘',
  cmd: '⌘',
  shift: '⇧',
  alt: '⌥',
  enter: '↵',
}

export const Kbd = ({
  children,
  className,
  ...rest
}: PropsWithChildren<Props>) => {
  const modifierKey = map[children as any]
  return (
    <kbd
      className={cn(
        'bg-foreground/20 text-foreground/60 flex h-5 min-w-5 items-center justify-center rounded px-1 text-xs',
        className,
      )}
      style={{
        fontFamily:
          "'Inter', --apple-system, BlinkMacSystemFont, Segoe UI, Roboto,Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
      }}
      {...rest}
    >
      {!modifierKey && children}
      {!!modifierKey && modifierKey}
    </kbd>
  )
}
