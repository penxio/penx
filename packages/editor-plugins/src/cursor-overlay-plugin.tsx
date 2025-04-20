'use client'

import { CursorOverlay } from '@penx/uikit/plate-ui/cursor-overlay'
import { CursorOverlayPlugin } from '@udecode/plate-selection/react'

export const cursorOverlayPlugin = CursorOverlayPlugin.configure({
  render: {
    afterEditable: () => <CursorOverlay />,
  },
})
