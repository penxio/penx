'use client'

import React from 'react'
import { AIChatPlugin } from '@/components/custom-plate-plugins/plate-ai/react'
import {
  insertBlock,
  insertInlineElement,
} from '@/components/editor/transforms'
import { withRef } from '@udecode/cn'
import { BlockquotePlugin } from '@udecode/plate-block-quote/react'
import { CodeBlockPlugin } from '@udecode/plate-code-block/react'
import { DatePlugin } from '@udecode/plate-date/react'
import { HEADING_KEYS } from '@udecode/plate-heading'
import { TocPlugin } from '@udecode/plate-heading/react'
import { INDENT_LIST_KEYS, ListStyleType } from '@udecode/plate-indent-list'
import { EquationPlugin, InlineEquationPlugin } from '@udecode/plate-math/react'
import { ImagePlugin } from '@udecode/plate-media/react'
import { TablePlugin } from '@udecode/plate-table/react'
import { TogglePlugin } from '@udecode/plate-toggle/react'
import {
  ParagraphPlugin,
  PlateElement,
  type PlateEditor,
} from '@udecode/plate/react'
import {
  CalendarIcon,
  ChevronRightIcon,
  Code2,
  Columns3Icon,
  DollarSignIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Image,
  Lightbulb,
  ListIcon,
  ListOrdered,
  MessageCircleMoreIcon,
  PilcrowIcon,
  Quote,
  RadicalIcon,
  ShoppingBagIcon,
  SparklesIcon,
  Square,
  Table,
  TableOfContentsIcon,
  TimerIcon,
  UserRoundIcon,
} from 'lucide-react'
import { CampaignPlugin } from '../custom-plate-plugins/campaign/react'
import { CommentBoxPlugin } from '../custom-plate-plugins/comment-box/react'
import { FriendsPlugin } from '../custom-plate-plugins/friends/react'
import { PodcastTimePlugin } from '../custom-plate-plugins/podcast-time/react'
import { BaseProductPlugin } from '../custom-plate-plugins/product'
import { ProductPlugin } from '../custom-plate-plugins/product/react'
import { ProjectsPlugin } from '../custom-plate-plugins/projects/react'
import { SocialLinksPlugin } from '../custom-plate-plugins/social-links/react'
import {
  InlineCombobox,
  InlineComboboxContent,
  InlineComboboxEmpty,
  InlineComboboxGroup,
  InlineComboboxGroupLabel,
  InlineComboboxInput,
  InlineComboboxItem,
} from './inline-combobox'

type Group = {
  group: string
  items: Item[]
}

interface Item {
  icon: React.ReactNode

  value: string

  onSelect: (editor: PlateEditor, value: string) => void
  className?: string
  focusEditor?: boolean
  keywords?: string[]
  label?: string
}

const groups: Group[] = [
  {
    group: 'AI',
    items: [
      {
        focusEditor: false,
        icon: <SparklesIcon />,
        value: 'AI',
        onSelect: (editor) => {
          editor.getApi(AIChatPlugin).aiChat.show()
        },
      },
    ],
  },
  {
    group: 'Basic blocks',
    items: [
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
        icon: <ListOrdered />,
        keywords: ['ordered', 'ol', '1'],
        label: 'Numbered list',
        value: ListStyleType.Decimal,
      },
      {
        icon: <Square />,
        keywords: ['checklist', 'task', 'checkbox', '[]'],
        label: 'To-do list',
        value: INDENT_LIST_KEYS.todo,
      },
      {
        icon: <ChevronRightIcon />,
        keywords: ['collapsible', 'expandable'],
        label: 'Toggle',
        value: TogglePlugin.key,
      },
      {
        icon: <Image />,
        keywords: ['image', 'img'],
        label: 'Image',
        value: ImagePlugin.key,
      },
      {
        icon: <Code2 />,
        keywords: ['```'],
        label: 'Code Block',
        value: CodeBlockPlugin.key,
      },
      {
        icon: <Table />,
        label: 'Table',
        value: TablePlugin.key,
      },
      {
        icon: <Quote />,
        keywords: ['citation', 'blockquote', 'quote', '>'],
        label: 'Blockquote',
        value: BlockquotePlugin.key,
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value)
      },
    })),
  },
  {
    group: 'Advanced blocks',
    items: [
      {
        icon: <TableOfContentsIcon />,
        keywords: ['toc'],
        label: 'Table of contents',
        value: TocPlugin.key,
      },
      {
        icon: <Columns3Icon />,
        label: '3 columns',
        value: 'action_three_columns',
      },
      {
        focusEditor: false,
        icon: <RadicalIcon />,
        label: 'Equation',
        value: EquationPlugin.key,
      },
      {
        focusEditor: false,
        icon: <ShoppingBagIcon />,
        label: 'Product',
        value: ProductPlugin.key,
      },
      {
        focusEditor: false,
        icon: <MessageCircleMoreIcon />,
        label: 'Comment Box',
        value: CommentBoxPlugin.key,
      },
      {
        focusEditor: false,
        icon: <Lightbulb />,
        label: 'Project',
        value: ProjectsPlugin.key,
      },
      {
        focusEditor: false,
        icon: <DollarSignIcon />,
        label: 'Campaign',
        value: CampaignPlugin.key,
      },
      {
        focusEditor: false,
        icon: <UserRoundIcon />,
        label: 'Friend Links',
        value: FriendsPlugin.key,
      },
      {
        focusEditor: false,
        icon: <UserRoundIcon />,
        label: 'Social Links',
        value: SocialLinksPlugin.key,
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value)
      },
    })),
  },
  {
    group: 'Inline',
    items: [
      {
        focusEditor: true,
        icon: <CalendarIcon />,
        keywords: ['time'],
        label: 'Date',
        value: DatePlugin.key,
      },
      {
        focusEditor: false,
        icon: <RadicalIcon />,
        label: 'Inline Equation',
        value: InlineEquationPlugin.key,
      },
      {
        focusEditor: false,
        icon: <TimerIcon />,
        label: 'Podcast time',
        value: PodcastTimePlugin.key,
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertInlineElement(editor, value)
      },
    })),
  },
]

export const SlashInputElement = withRef<typeof PlateElement>(
  ({ className, ...props }, ref) => {
    const { children, editor, element } = props

    return (
      <PlateElement
        ref={ref}
        as="span"
        className={className}
        data-slate-value={element.value}
        {...props}
      >
        <InlineCombobox element={element} trigger="/">
          <InlineComboboxInput />

          <InlineComboboxContent>
            <InlineComboboxEmpty>No results</InlineComboboxEmpty>

            {groups.map(({ group, items }) => (
              <InlineComboboxGroup key={group}>
                <InlineComboboxGroupLabel>{group}</InlineComboboxGroupLabel>

                {items.map(
                  ({ focusEditor, icon, keywords, label, value, onSelect }) => (
                    <InlineComboboxItem
                      key={value}
                      value={value}
                      onClick={() => onSelect(editor, value)}
                      label={label}
                      focusEditor={focusEditor}
                      group={group}
                      keywords={keywords}
                    >
                      <div className="text-muted-foreground mr-2">{icon}</div>
                      {label ?? value}
                    </InlineComboboxItem>
                  ),
                )}
              </InlineComboboxGroup>
            ))}
          </InlineComboboxContent>
        </InlineCombobox>

        {children}
      </PlateElement>
    )
  },
)
