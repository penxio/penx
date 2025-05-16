'use client'

import * as React from 'react'
import { DropdownMenuItemIndicator } from '@radix-ui/react-dropdown-menu'
import type { TElement } from '@udecode/plate'
import { BlockquotePlugin } from '@udecode/plate-block-quote/react'
import { CodeBlockPlugin } from '@udecode/plate-code-block/react'
import { HEADING_KEYS } from '@udecode/plate-heading'
import { INDENT_LIST_KEYS, ListStyleType } from '@udecode/plate-indent-list'
import { TogglePlugin } from '@udecode/plate-toggle/react'
import { ParagraphPlugin, useSelectionFragmentProp } from '@udecode/plate/react'
import {
  CheckIcon,
  ChevronRightIcon,
  Columns3Icon,
  FileCodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ListIcon,
  ListOrderedIcon,
  PilcrowIcon,
  QuoteIcon,
  SquareIcon,
} from 'lucide-react'
import {
  getBlockType,
  setBlockType,
  STRUCTURAL_TYPES,
} from '@penx/editor-transforms'
import { cn } from '@penx/utils'

const turnIntoItems = [
  {
    icon: <PilcrowIcon />,
    keywords: ['paragraph'],
    label: 'Text',
    value: ParagraphPlugin.key,
  },
  {
    icon: <Heading1Icon />,
    keywords: ['title', 'h1'],
    label: 'Heading 1',
    value: HEADING_KEYS.h1,
  },
  {
    icon: <Heading2Icon />,
    keywords: ['subtitle', 'h2'],
    label: 'Heading 2',
    value: HEADING_KEYS.h2,
  },
  {
    icon: <Heading3Icon />,
    keywords: ['subtitle', 'h3'],
    label: 'Heading 3',
    value: HEADING_KEYS.h3,
  },
  {
    icon: <ListIcon />,
    keywords: ['unordered', 'ul', '-'],
    label: 'Bulleted list',
    value: ListStyleType.Disc,
  },
  {
    icon: <ListOrderedIcon />,
    keywords: ['ordered', 'ol', '1'],
    label: 'Numbered list',
    value: ListStyleType.Decimal,
  },
  {
    icon: <SquareIcon />,
    keywords: ['checklist', 'task', 'checkbox', '[]'],
    label: 'To-do list',
    value: INDENT_LIST_KEYS.todo,
  },
  {
    icon: <ChevronRightIcon />,
    keywords: ['collapsible', 'expandable'],
    label: 'Toggle list',
    value: TogglePlugin.key,
  },
  {
    icon: <FileCodeIcon />,
    keywords: ['```'],
    label: 'Code',
    value: CodeBlockPlugin.key,
  },
  {
    icon: <QuoteIcon />,
    keywords: ['citation', 'blockquote', '>'],
    label: 'Quote',
    value: BlockquotePlugin.key,
  },
  {
    icon: <Columns3Icon />,
    label: '3 columns',
    value: 'action_three_columns',
  },
]

interface Props {
  className?: string
  selectType: (type: string) => void
}

export function TurnIntoMenu({ className, selectType }: Props) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {turnIntoItems.map(({ icon, label, value: itemValue }) => (
        <div
          key={itemValue}
          className="text-foreground/60 flex size-8 shrink-0 items-center justify-center"
          onClick={() => {
            selectType(itemValue)
          }}
        >
          {icon}
        </div>
      ))}
    </div>
  )
}
