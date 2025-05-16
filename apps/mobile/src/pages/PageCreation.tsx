import React, { useEffect, useRef, useState } from 'react'
import { CreationMenu } from '@/components/CreationMenu'
import { MobileCreation } from '@/components/MobileCreation'
import { Capacitor } from '@capacitor/core'
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonHeader,
  IonModal,
  IonToolbar,
} from '@ionic/react'

const platform = Capacitor.getPlatform()

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
      <IonHeader
        className={platform === 'android' ? 'safe-area' : ''}
        style={{
          boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
        }}
      >
        <IonToolbar
          className="toolbar"
          style={{
            '--border-width': 0,
            // borderBottom: scrolled ? '1px solid #eeee' : 'none',
            // borderBottom: 'none',
            // border: 'none',
          }}
        >
          <IonButtons slot="start">
            <IonBackButton color="dark" text=""></IonBackButton>
          </IonButtons>
          {/* <IonTitle>Welcome</IonTitle> */}
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
      </IonHeader>
      <IonContent className="ion-padding">
        <MobileCreation creationId={creationId} />
      </IonContent>
    </>
  )
}
