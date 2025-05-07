'use client'

import React, { useEffect, useState } from 'react'
import { CreationInputToolbar } from '@/components/CreationInputToolbar'
import { MobileCreation } from '@/components/MobileCreation'
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonMenuButton,
  IonNavLink,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import {
  add,
  chevronDownCircle,
  chevronForwardCircle,
  chevronUpCircle,
  colorPalette,
  document,
  ellipsisHorizontal,
  globe,
  notificationsOutline,
} from 'ionicons/icons'

interface PageDetailProps {
  id: string
}

export function PageDetail({ id }: PageDetailProps) {
  return (
    <>
      <IonHeader
        style={{
          boxShadow: '0 0 0 rgba(0, 0, 0, 0.2)',
        }}
      >
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="" color="dark"></IonBackButton>
          </IonButtons>
          {/* <IonTitle
            onClick={() => {
              console.log('name........')
            }}
          >
            Feed
          </IonTitle> */}
          {/* <IonButtons slot="end">
            <IonMenuButton />
          </IonButtons> */}
          <IonButtons slot="end">
            <IonButton
              color="dark"
              onClick={() => {
                //
                console.log('more.........')
              }}
            >
              <IonIcon icon={ellipsisHorizontal} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <MobileCreation creationId={id} />
      </IonContent>
      {/* <CreationInputToolbar /> */}
    </>
  )
}
