import React from 'react'
import { cn } from '@udecode/cn'
import { SlateElement, type SlateElementProps } from '@udecode/plate'
import type { TEquationElement } from '@udecode/plate-math'
import { getEquationHtml } from '@udecode/plate-math'
import { RadicalIcon } from 'lucide-react'

export function EquationElementStatic({
  children,
  className,
  ...props
}: SlateElementProps) {
  const element = props.element as TEquationElement

  const html = getEquationHtml({
    element,
    options: {
      displayMode: true,
      errorColor: '#cc0000',
      fleqn: false,
      leqno: false,
      macros: { '\\f': '#1f(#2)' },
      output: 'htmlAndMathml',
      strict: 'warn',
      throwOnError: false,
      trust: false,
    },
  })

  return (
    <SlateElement className={cn('my-1', className)} {...props}>
      <div
        className={cn(
          'hover:bg-primary/10 data-[selected=true]:bg-primary/10 group flex select-none items-center justify-center rounded-sm',
          element.texExpression.length === 0
            ? 'bg-muted p-3 pr-9'
            : 'px-2 py-1',
        )}
      >
        {element.texExpression.length > 0 ? (
          <span
            dangerouslySetInnerHTML={{
              __html: html,
            }}
          />
        ) : (
          <div className="text-muted-foreground flex h-7 w-full items-center gap-2 whitespace-nowrap text-sm">
            <RadicalIcon className="text-muted-foreground/80 size-6" />
            <div>Add a Tex equation</div>
          </div>
        )}
      </div>
      {children}
    </SlateElement>
  )
}
