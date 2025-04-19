'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@udecode/cn'
import type { SlateElementProps } from '@udecode/plate'
import { SlateElement } from '@udecode/plate'
import type { TCodeBlockElement } from '@udecode/plate-code-block'
import './code-block-element.css'

export const CodeBlockElementStatic = ({
  children,
  className,
  ...props
}: SlateElementProps<TCodeBlockElement>) => {
  const { element } = props

  const state = {
    className: element?.lang ? `${element.lang} language-${element.lang}` : '',
  }

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <SlateElement className={cn(className, 'py-1', state.className)} {...props}>
      <pre className="bg-muted text-foreground/70 overflow-x-auto rounded-md px-6 py-8 font-mono text-sm leading-[normal] [tab-size:2]">
        <code>{children}</code>
      </pre>
    </SlateElement>
  )
}
