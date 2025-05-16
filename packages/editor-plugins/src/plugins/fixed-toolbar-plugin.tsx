'use client'

import { createPlatePlugin } from '@udecode/plate/react'
import { FixedToolbar } from '@penx/editor-plugins/plate-ui/fixed-toolbar'
import { FixedToolbarButtons } from '@penx/editor-plugins/plate-ui/fixed-toolbar-buttons'

export const FixedToolbarPlugin = createPlatePlugin({
  key: 'fixed-toolbar',
  render: {
    beforeEditable: () => {
      return (
        <div className="sm:px-[max(10px,calc(50%-350px))]">
          <FixedToolbar className="bg-background">
            <FixedToolbarButtons />
          </FixedToolbar>
        </div>
      )
    },
  },
})
