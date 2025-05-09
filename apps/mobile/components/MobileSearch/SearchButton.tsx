'use client'

import React, { useRef, useState } from 'react'
import { IonButton, IonButtons, IonIcon } from '@ionic/react'
import { searchOutline } from 'ionicons/icons'
import { Drawer } from 'vaul'
import { DialogDescription, DialogTitle } from '@penx/uikit/dialog'
import { SearchPanel } from './SearchPanel'

export function SearchButton() {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <IonButtons slot="end">
        <IonButton
          color="dark"
          onClick={() => {
            setVisible(true)
          }}
        >
          <IonIcon icon={searchOutline} />
        </IonButton>
      </IonButtons>

      <Drawer.Root open={visible} onOpenChange={setVisible}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="bg-background fixed bottom-0 left-0 right-0 flex max-h-[95vh] min-h-[95vh] flex-col rounded-t-[10px] px-0 pb-0 outline-none">
            <div
              aria-hidden
              className="mx-auto mb-4 mt-2 h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300"
            />

            <DialogTitle className="hidden">
              <DialogDescription />
            </DialogTitle>
            <SearchPanel setVisible={setVisible} />
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  )
}
