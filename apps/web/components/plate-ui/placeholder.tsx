'use client'

import React from 'react'
import { cn } from '@udecode/cn'
import { HEADING_KEYS } from '@udecode/plate-heading'
import {
  createNodeHOC,
  createNodesHOC,
  ParagraphPlugin,
  usePlaceholderState,
  type PlaceholderProps,
} from '@udecode/plate/react'

export const Placeholder = (props: PlaceholderProps) => {
  const { children, nodeProps, placeholder } = props

  const { enabled } = usePlaceholderState(props)

  return React.Children.map(children, (child) => {
    return React.cloneElement(child, {
      className: child.props.className,
      nodeProps: {
        ...nodeProps,
        className: cn(
          enabled &&
            'before:absolute before:cursor-text before:opacity-30 before:content-[attr(placeholder)]',
        ),
        placeholder,
      },
    })
  })
}

export const withPlaceholder = createNodeHOC(Placeholder)

export const withPlaceholdersPrimitive = createNodesHOC(Placeholder)

export const withPlaceholders = (
  components: any,
  placeholder = `Type '/' for commands`,
) =>
  withPlaceholdersPrimitive(components, [
    {
      key: ParagraphPlugin.key,
      hideOnBlur: true,
      placeholder,
      query: {
        maxLevel: 1,
      },
    },
    {
      key: HEADING_KEYS.h1,
      hideOnBlur: false,
      placeholder: 'Heading 1',
    },
    {
      key: HEADING_KEYS.h2,
      hideOnBlur: false,
      placeholder: 'Heading 2',
    },
    {
      key: HEADING_KEYS.h3,
      hideOnBlur: false,
      placeholder: 'Heading 3',
    },
  ])
