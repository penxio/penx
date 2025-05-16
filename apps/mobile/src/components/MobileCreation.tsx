'use client'

import React, { useRef } from 'react'
import { Keyboard } from '@capacitor/keyboard'
import { IonFab } from '@ionic/react'
import { Editor } from 'slate'
import { Creation } from '@penx/components/Creation'
import { PanelCreationProvider } from '@penx/components/PanelCreationProvider'
import { PublishDialog } from '@penx/components/PublishDialog'
import { setBlockType } from '@penx/editor-transforms'
import { TurnIntoMenu } from './TurnIntoMenu'

interface Props {
  // creation: ICreation;
  creationId: string
}

export function MobileCreation({ creationId }: Props) {
  const editorRef = useRef<Editor>(null)
  return (
    <PanelCreationProvider creationId={creationId}>
      <PublishDialog />
      <Creation ref={editorRef} />
      <IonFab
        slot="fixed"
        vertical="bottom"
        className="bottom-0 z-10 flex h-10 w-full items-center justify-center border-t"
      >
        <div className="border-foreground/10 flex h-full w-full flex-1 items-center border-t bg-neutral-50 dark:bg-neutral-800">
          <TurnIntoMenu
            className="flex-1 overflow-x-auto"
            selectType={(type) => {
              setBlockType(editorRef.current as any, type)
            }}
          />
          <div
            className="text-foreground/80 border-foreground/10 flex h-8 w-8 items-center justify-center border-l"
            onClick={() => {
              Keyboard.hide()
            }}
          >
            <span className="icon-[mdi--keyboard-close-outline] size-6"></span>
          </div>
        </div>
      </IonFab>
    </PanelCreationProvider>
  )
}
