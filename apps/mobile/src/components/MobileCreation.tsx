'use client'

import React, { useRef } from 'react'
import { useKeyboard } from '@/hooks/useKeyboard'
import { Keyboard } from '@capacitor/keyboard'
import { NavigationBar } from '@capgo/capacitor-navigation-bar'
import { useQuery } from '@tanstack/react-query'
import { Creation } from '@penx/components/Creation'
import { PanelCreationProvider } from '@penx/components/PanelCreationProvider'
import { PublishDialog } from '@penx/components/PublishDialog'
import { FixedToolbar } from './FixedToolbar'

interface Props {
  // creation: ICreation;
  creationId: string
}

export function MobileCreation({ creationId }: Props) {
  return (
    <PanelCreationProvider creationId={creationId}>
      <PublishDialog />
      <Creation editorFooter={<FixedToolbar />} />
    </PanelCreationProvider>
  )
}
