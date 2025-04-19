'use client'

import { FloatingToolbar } from '@penx/uikit/plate-ui/floating-toolbar'
import { FloatingToolbarButtons } from '@penx/uikit/plate-ui/floating-toolbar-buttons'
import { createPlatePlugin } from '@udecode/plate/react'

export const FloatingToolbarPlugin = createPlatePlugin({
  key: 'floating-toolbar',
  render: {
    afterEditable: () => (
      <FloatingToolbar>
        <FloatingToolbarButtons />
      </FloatingToolbar>
    ),
  },
})
