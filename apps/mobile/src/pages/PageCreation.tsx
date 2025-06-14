import React, { useEffect, useRef, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { CreationMenu } from '@/components/CreationMenu'
import { MobileContent } from '@/components/MobileContent'
import { MobileCreation } from '@/components/MobileCreation'
import { MobileHeaderWrapper } from '@/components/MobileHeaderWrapper'
import { isAndroid } from '@/lib/utils'
import { Capacitor } from '@capacitor/core'
import { PanelCreationProvider } from '@penx/components/Creation/PanelCreationProvider'

export const PageCreation = ({
  creationId,
  nav,
}: {
  creationId: string
  nav: HTMLIonNavElement
}) => {
  // const { creationId, setCreationId } = useCreationId()

  // if (!creationId) return null

  return (
    <>
      {/* <IonHeader
        // className={isAndroid ? 'safe-area' : ''}
        className={'safe-area'}
        style={{
          boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
        }}
      >
        <IonToolbar
          className="text-foreground toolbar"
          style={{
            '--border-width': 0,
          }}
        >
          <IonButtons slot="start">
            <IonBackButton text=""></IonBackButton>
          </IonButtons>
          <IonButtons slot="end">
            <CreationMenu
              creationId={creationId}
              afterDelete={() => {
                // modal.current?.dismiss()
                nav.pop()
              }}
            />
          </IonButtons>
        </IonToolbar>
      </IonHeader> */}
      <MobileContent
        backgroundColor="#f6f6f6"
        rightSlot={
          <CreationMenu
            creationId={creationId}
            afterDelete={() => {
              // modal.current?.dismiss()
              nav.pop()
            }}
          />
        }
      >
        <PanelCreationProvider creationId={creationId}>
          <MobileCreation creationId={creationId} />
        </PanelCreationProvider>
      </MobileContent>

      {/* <IonFooter style={{}}>
        <IonToolbar>
          <IonButton>Bold</IonButton>
          <IonButton>Italic</IonButton>
        </IonToolbar> */}
      {/* </IonFooter> */}
    </>
  )
}
