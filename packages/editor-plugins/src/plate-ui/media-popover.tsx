'use client'

import * as React from 'react'
import { Button, buttonVariants } from './button'
import { Popover, PopoverAnchor, PopoverContent } from './popover'
import { Separator } from './separator'
import type { WithRequiredKey } from '@udecode/plate'
import {
  FloatingMedia as FloatingMediaPrimitive,
  FloatingMediaStore,
  useFloatingMediaValue,
  useImagePreviewValue,
} from '@udecode/plate-media/react'
import {
  useEditorRef,
  useEditorSelector,
  useElement,
  useReadOnly,
  useRemoveNodeButton,
  useSelected,
} from '@udecode/plate/react'
import { cva } from 'class-variance-authority'
import { Link, Trash2Icon } from 'lucide-react'
import { CaptionButton } from './caption'

const inputVariants = cva(
  'placeholder:text-muted-foreground flex h-[28px] w-full rounded-md border-none bg-transparent px-1.5 py-1 text-base focus-visible:outline-none focus-visible:ring-transparent md:text-sm',
)

export interface MediaPopoverProps {
  children: React.ReactNode
  plugin: WithRequiredKey
}

export function MediaPopover({ children, plugin }: MediaPopoverProps) {
  const editor = useEditorRef()
  const readOnly = useReadOnly()
  const selected = useSelected()

  const selectionCollapsed = useEditorSelector(
    (editor) => !editor.api.isExpanded(),
    [],
  )
  const isImagePreviewOpen = useImagePreviewValue('isOpen', editor.id)
  const isOpen =
    !readOnly && selected && selectionCollapsed && !isImagePreviewOpen
  const isEditing = useFloatingMediaValue('isEditing')

  React.useEffect(() => {
    if (!isOpen && isEditing) {
      FloatingMediaStore.set('isEditing', false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const element = useElement()
  const { props: buttonProps } = useRemoveNodeButton({ element })

  if (readOnly) return <>{children}</>

  return (
    <Popover open={isOpen} modal={false}>
      <PopoverAnchor>{children}</PopoverAnchor>

      <PopoverContent
        className="w-auto p-1"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {isEditing ? (
          <div className="flex w-[330px] flex-col">
            <div className="flex items-center">
              <div className="text-muted-foreground flex items-center pl-2 pr-1">
                <Link className="size-4" />
              </div>

              <FloatingMediaPrimitive.UrlInput
                className={inputVariants()}
                placeholder="Paste the embed link..."
                options={{ plugin }}
              />
            </div>
          </div>
        ) : (
          <div className="box-content flex items-center">
            <FloatingMediaPrimitive.EditButton
              className={buttonVariants({ size: 'sm', variant: 'ghost' })}
            >
              Edit link
            </FloatingMediaPrimitive.EditButton>

            <CaptionButton variant="ghost">Caption</CaptionButton>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <Button size="icon" variant="ghost" {...buttonProps}>
              <Trash2Icon />
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
