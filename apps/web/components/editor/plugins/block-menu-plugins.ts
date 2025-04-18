'use client'

import { BlockContextMenu } from '@/components/plate-ui/block-context-menu'
import { BlockMenuPlugin } from '@udecode/plate-selection/react'
import { blockSelectionPlugins } from './block-selection-plugins'

export const blockMenuPlugins = [
  ...blockSelectionPlugins,
  BlockMenuPlugin.configure({
    render: { aboveEditable: BlockContextMenu },
  }),
] as const
