'use client'

import { BlockContextMenu } from '@penx/editor-plugins/plate-ui/block-context-menu'
import { BlockMenuPlugin } from '@udecode/plate-selection/react'
import { blockSelectionPlugins } from './block-selection-plugins'

export const blockMenuPlugins = [
  ...blockSelectionPlugins,
  BlockMenuPlugin.configure({
    render: { aboveEditable: BlockContextMenu },
  }),
] as const
