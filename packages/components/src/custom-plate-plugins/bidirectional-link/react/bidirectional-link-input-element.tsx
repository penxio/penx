'use client'

import React, { useState } from 'react'
import { useAreaCreationsContext } from '@/components/AreaCreationsContext'
import {
  InlineCombobox,
  InlineComboboxContent,
  InlineComboboxEmpty,
  InlineComboboxGroup,
  InlineComboboxInput,
  InlineComboboxItem,
} from '@penx/uikit/plate-ui/inline-combobox'
import { cn } from '@penx/utils'
import { withRef } from '@udecode/cn'
import { PlateElement } from '@udecode/plate/react'
import { getBidirectionalLinkOnSelectItem } from '../lib'

const onSelectItem = getBidirectionalLinkOnSelectItem()

export const BidirectionalLinkInputElement = withRef<typeof PlateElement>(
  ({ className, ...props }, ref) => {
    const { children, editor, element } = props
    return (
      <PlateElement
        ref={ref}
        as="span"
        className={cn(className, 'min-h-40')}
        data-slate-value={element.value}
        {...props}
      >
        <Content editor={editor} element={element} />
        {children}
      </PlateElement>
    )
  },
)

function Content({ editor, element }: any) {
  const [search, setSearch] = useState('')
  const creations = useAreaCreationsContext()

  return (
    <InlineCombobox
      value={search}
      element={element}
      setValue={setSearch}
      trigger="[["
    >
      <span className="bg-muted ring-ring inline-block rounded-md px-1.5 py-0.5 align-baseline text-sm focus-within:ring-2">
        <InlineComboboxInput />
      </span>

      <InlineComboboxContent className="my-1.5">
        <InlineComboboxEmpty>No results</InlineComboboxEmpty>

        <InlineComboboxGroup>
          {creations.map((item) => (
            <InlineComboboxItem
              key={item.id}
              value={item.id}
              onClick={() => onSelectItem(editor, item, search)}
            >
              {item.title}
            </InlineComboboxItem>
          ))}
        </InlineComboboxGroup>
      </InlineComboboxContent>
    </InlineCombobox>
  )
}
