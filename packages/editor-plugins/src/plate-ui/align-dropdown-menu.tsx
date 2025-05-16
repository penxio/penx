'use client'

import * as React from 'react'
import { STRUCTURAL_TYPES } from '@penx/editor-transforms'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from './dropdown-menu'
import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu'
import { setAlign, type Alignment } from '@udecode/plate-alignment'
import { useEditorRef, useSelectionFragmentProp } from '@udecode/plate/react'
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
} from 'lucide-react'
import { ToolbarButton } from './toolbar'

const items = [
  {
    icon: AlignLeftIcon,
    value: 'left',
  },
  {
    icon: AlignCenterIcon,
    value: 'center',
  },
  {
    icon: AlignRightIcon,
    value: 'right',
  },
  {
    icon: AlignJustifyIcon,
    value: 'justify',
  },
]

export function AlignDropdownMenu(props: DropdownMenuProps) {
  const editor = useEditorRef()
  const value = useSelectionFragmentProp({
    defaultValue: 'start',
    structuralTypes: STRUCTURAL_TYPES,
    getProp: (node) => node.align,
  })

  const [open, setOpen] = React.useState(false)
  const IconValue =
    items.find((item) => item.value === value)?.icon ?? AlignLeftIcon

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={open} tooltip="Align" isDropdown>
          <IconValue />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-0" align="start">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(value) => {
            setAlign(editor, { value: value as Alignment })
            editor.tf.focus()
          }}
        >
          {items.map(({ icon: Icon, value: itemValue }) => (
            <DropdownMenuRadioItem
              key={itemValue}
              className="*:first:[span]:hidden pl-2"
              value={itemValue}
            >
              <Icon />
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
