'use client'

import React, { useRef, useState } from 'react'
import { AreasPopover } from '@/components/AreasPopover'
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonModal,
  IonNav,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react'
import { add, searchOutline } from 'ionicons/icons'
import { AreaDialog } from '@penx/components/AreaDialog'
import { useAddCreation } from '@penx/hooks/useAddCreation'
import { creationIdAtom } from '@penx/hooks/useCreationId'
import { store } from '@penx/store'
import { CreationType } from '@penx/types'
import { MobileHome } from '../MobileHome'

export function PageHome() {
  const addCreation = useAddCreation()
  const modal = useRef<HTMLIonModalElement>(null)

  return (
    <>
      {/* <CommandPanel /> */}
      <AreaDialog />
      <IonHeader
        style={{
          boxShadow: '0 0 0 rgba(0, 0, 0, 0.2)',
        }}
      >
        <IonToolbar>
          <IonTitle slot="start" class="pl-3">
            <AreasPopover
              oncClick={() => {
                modal.current!.present()
              }}
            />
          </IonTitle>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton
              color="black"
              onClick={() => {
                console.log('search')
              }}
            >
              <IonIcon color="black" icon={searchOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent
        className="ion-padding home-bg "
        fullscreen
        style={{
          // '--background': 'antiquewhite',
          '--background': '#f0f0f0',
        }}
      >
        <div
          className="pb-14"
          style={
            {
              '--background': 'oklch(1 0 0)',
            } as any
          }
        >
          <MobileHome />
        </div>
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton
            className=""
            color="dark"
            // style={{ '--background': '#ff5722' }}
            onClick={async () => {
              const creation = await addCreation(CreationType.PAGE)
              store.set(creationIdAtom, creation.id)
            }}
          >
            <IonIcon className="" icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </>
  )
}
