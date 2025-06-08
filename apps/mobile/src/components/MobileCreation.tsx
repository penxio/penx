'use client'

import React, { useRef } from 'react'
import { useKeyboard } from '@/hooks/useKeyboard'
import { useQuery } from '@tanstack/react-query'
import { Creation } from '@penx/components/Creation'
import { PanelCreationProvider } from '@penx/components/PanelCreationProvider'
import { PublishDialog } from '@penx/components/PublishDialog'
import { FixedToolbar } from './FixedToolbar'
import { KeyboardPadding } from './KeyboardPadding'

interface Props {
  // creation: ICreation;
  creationId: string
}

export function MobileCreation({ creationId }: Props) {
  const { height } = useKeyboard()
  return (
    <PanelCreationProvider creationId={creationId}>
      <PublishDialog />
      <div className="flex min-h-full flex-col">
        <Creation
          editorFooter={
            <>
              <FixedToolbar />
              <KeyboardPadding></KeyboardPadding>
            </>
          }
        />
      </div>
    </PanelCreationProvider>
  )
}
