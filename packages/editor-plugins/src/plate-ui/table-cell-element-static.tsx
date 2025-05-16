import * as React from 'react'
import { cn } from '@penx/utils'
import type { SlateElementProps } from '@udecode/plate'
import { SlateElement } from '@udecode/plate'
import type { TTableCellElement } from '@udecode/plate-table'
import { BaseTablePlugin } from '@udecode/plate-table'

export function TableCellElementStatic({
  isHeader,
  ...props
}: SlateElementProps<TTableCellElement> & {
  isHeader?: boolean
}) {
  const { editor, element } = props
  const { api } = editor.getPlugin(BaseTablePlugin)

  const { minHeight, width } = api.table.getCellSize({ element })
  const borders = api.table.getCellBorders({ element })

  return (
    <SlateElement
      {...props}
      as={isHeader ? 'th' : 'td'}
      className={cn(
        'bg-background h-full overflow-visible border-none p-0',
        element.background ? 'bg-(--cellBackground)' : 'bg-background',
        isHeader && 'text-left font-normal *:m-0',
        'before:size-full',
        "before:absolute before:box-border before:select-none before:content-['']",
        borders &&
          cn(
            borders.bottom?.size && `before:border-b-border before:border-b`,
            borders.right?.size && `before:border-r-border before:border-r`,
            borders.left?.size && `before:border-l-border before:border-l`,
            borders.top?.size && `before:border-t-border before:border-t`,
          ),
      )}
      style={
        {
          '--cellBackground': element.background,
          maxWidth: width || 240,
          minWidth: width || 120,
        } as React.CSSProperties
      }
      attributes={{
        ...props.attributes,
        colSpan: api.table.getColSpan(element),
        rowSpan: api.table.getRowSpan(element),
      }}
    >
      <div
        className="relative z-20 box-border h-full px-4 py-2"
        style={{ minHeight }}
      >
        {props.children}
      </div>
    </SlateElement>
  )
}

export function TableCellHeaderStaticElement(
  props: SlateElementProps<TTableCellElement>,
) {
  return <TableCellElementStatic {...props} isHeader />
}
