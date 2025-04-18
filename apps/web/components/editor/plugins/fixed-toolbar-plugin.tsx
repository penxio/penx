'use client'

import { FixedToolbar } from '@/components/plate-ui/fixed-toolbar'
import { FixedToolbarButtons } from '@/components/plate-ui/fixed-toolbar-buttons'
import { createPlatePlugin } from '@udecode/plate/react'

export const FixedToolbarPlugin = createPlatePlugin({
  key: 'fixed-toolbar',
  render: {
    beforeEditable: () => (
      <div className="sm:px-[max(10px,calc(50%-350px))]">
        <FixedToolbar className="bg-background">
          <FixedToolbarButtons />
        </FixedToolbar>
      </div>
    ),
  },
})
