'use client'

import * as React from 'react'
import { Button } from './button'
import { cn } from '@penx/utils'
import { useComposedRef } from '@udecode/cn'
import { PathApi, type TElement } from '@udecode/plate'
import { useDraggable, useDropLine } from '@udecode/plate-dnd'
import { BlockSelectionPlugin } from '@udecode/plate-selection/react'
import type { TTableRowElement } from '@udecode/plate-table'
import {
  PlateElement,
  useEditorRef,
  useElement,
  usePluginOption,
  useReadOnly,
  useSelected,
  type PlateElementProps,
} from '@udecode/plate/react'
import { GripVertical } from 'lucide-react'

export function TableRowElement(props: PlateElementProps<TTableRowElement>) {
  const { element } = props
  const readOnly = useReadOnly()
  const selected = useSelected()
  const editor = useEditorRef()
  const isSelectionAreaVisible = usePluginOption(
    BlockSelectionPlugin,
    'isSelectionAreaVisible',
  )
  const hasControls = !readOnly && !isSelectionAreaVisible

  const { isDragging, previewRef, handleRef } = useDraggable({
    element,
    type: element.type,
    canDropNode: ({ dragEntry, dropEntry }) =>
      PathApi.equals(
        PathApi.parent(dragEntry[1]),
        PathApi.parent(dropEntry[1]),
      ),
    onDropHandler: (_, { dragItem }) => {
      const dragElement = (dragItem as { element: TElement }).element

      if (dragElement) {
        editor.tf.select(dragElement)
      }
    },
  })

  return (
    <PlateElement
      {...props}
      ref={useComposedRef(props.ref, previewRef)}
      as="tr"
      className={cn('group/row', isDragging && 'opacity-50')}
      attributes={{
        ...props.attributes,
        'data-selected': selected ? 'true' : undefined,
      }}
    >
      {hasControls && (
        <td className="w-2 select-none" contentEditable={false}>
          <RowDragHandle dragRef={handleRef} />
          <DropLine />
        </td>
      )}

      {props.children}
    </PlateElement>
  )
}

function RowDragHandle({ dragRef }: { dragRef: React.Ref<any> }) {
  const editor = useEditorRef()
  const element = useElement()

  return (
    <Button
      ref={dragRef}
      variant="outline"
      className={cn(
        'z-51 absolute left-0 top-1/2 h-6 w-4 -translate-y-1/2 p-0 focus-visible:ring-0 focus-visible:ring-offset-0',
        'cursor-grab active:cursor-grabbing',
        'group-has-data-[resizing="true"]/row:opacity-0 opacity-0 transition-opacity duration-100 group-hover/row:opacity-100',
      )}
      onClick={() => {
        editor.tf.select(element)
      }}
    >
      <GripVertical className="text-muted-foreground" />
    </Button>
  )
}

function DropLine() {
  const { dropLine } = useDropLine()

  if (!dropLine) return null

  return (
    <div
      className={cn(
        'bg-brand/50 absolute inset-x-0 left-2 z-50 h-0.5',
        dropLine === 'top' ? '-top-px' : '-bottom-px',
      )}
    />
  )
}
