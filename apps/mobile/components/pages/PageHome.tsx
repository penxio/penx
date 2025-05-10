'use client'

import React, { useEffect, useRef, useState } from 'react'
import { AreasPopover } from '@/components/AreasPopover'
import { SocialLogin } from '@capgo/capacitor-social-login'
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
import { PlusIcon, SearchIcon, UserRoundIcon } from 'lucide-react'
import { AreaDialog } from '@penx/components/AreaDialog'
import { useAddCreation } from '@penx/hooks/useAddCreation'
import { creationIdAtom } from '@penx/hooks/useCreationId'
import { store } from '@penx/store'
import { CreationType } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { Separator } from '@penx/uikit/separator'
import { LoginButton } from '../Login/LoginButton'
import { MobileHome } from '../MobileHome'
import { SearchButton } from '../MobileSearch/SearchButton'

export function PageHome() {
  const addCreation = useAddCreation()
  const modal = useRef<HTMLIonModalElement>(null)

  useEffect(() => {
    SocialLogin.initialize({
      google: {
        iOSClientId:
          '864679274232-ijpm9pmvthvuhtoo77j387gudd1ibvii.apps.googleusercontent.com',
      },
    })
  }, [])

  const [json, setJSON] = useState({})

  return (
    <>
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
          {/* <SearchButton /> */}
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
        <IonFab
          slot="fixed"
          vertical="bottom"
          className="flex w-full justify-center pb-2"
        >
          <div className="border-foreground/4 flex h-10 items-center gap-1 rounded-full border bg-white px-2 shadow-md">
            <SearchButton />
            <Separator orientation="vertical" className="h-4" />{' '}
            <Button
              size="icon"
              variant="ghost"
              className="size-7 rounded-full"
              onClick={async () => {
                const creation = await addCreation(CreationType.PAGE)
                store.set(creationIdAtom, creation.id)
              }}
            >
              <PlusIcon size={20} />
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <LoginButton />
          </div>
        </IonFab>
      </IonContent>
    </>
  )
}
