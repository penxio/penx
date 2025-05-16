import * as React from 'react'
import { cn } from '@penx/utils'
import type { SlateRenderElementProps } from '@udecode/plate'
import { CheckIcon } from 'lucide-react'

export function TodoMarkerStatic(
  props: Omit<SlateRenderElementProps, 'children'>,
) {
  return (
    <div contentEditable={false}>
      <CheckboxStatic
        className="pointer-events-none absolute -left-6 top-1"
        checked={props.element.checked as boolean}
      />
    </div>
  )
}

export function TodoLiStatic(props: SlateRenderElementProps) {
  return (
    <li
      className={cn(
        'list-none',
        (props.element.checked as boolean) &&
          'text-muted-foreground line-through',
      )}
    >
      {props.children}
    </li>
  )
}

type CheckboxStaticProps = {
  checked: boolean
  className?: string
  style?: React.CSSProperties
}

function CheckboxStatic(props: CheckboxStaticProps) {
  return (
    <button
      className={cn(
        'border-primary bg-background ring-offset-background focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground peer size-4 shrink-0 rounded-sm border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        props.className,
      )}
      style={props.style}
      data-state={props.checked ? 'checked' : 'unchecked'}
      type="button"
    >
      <div className={cn('flex items-center justify-center text-current')}>
        {props.checked && <CheckIcon className="size-4" />}
      </div>
    </button>
  )
}
