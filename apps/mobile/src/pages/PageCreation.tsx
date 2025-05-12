import React, { useEffect, useRef, useState } from 'react'
import { MobileCreation } from '@/components/MobileCreation'
import { Capacitor } from '@capacitor/core'
import { OverlayEventDetail } from '@ionic/core'
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { cog, ellipsisHorizontal } from 'ionicons/icons'
import { PlusIcon, XIcon } from 'lucide-react'
import { appEmitter } from '@penx/emitter'
import { ICreationNode } from '@penx/model-type'

const platform = Capacitor.getPlatform()

export const PageCreation: React.FC = () => {
  const modal = useRef<HTMLIonModalElement>(null)
  const [creationId, setCreationId] = useState('')

  useEffect(() => {
    // if (initRef.current) return
    // initRef.current = true
    function handle(creation: ICreationNode) {
      console.log('handle route to creation: ', creation.id)
      setCreationId(creation.id)
      modal.current?.present()
    }

    appEmitter.on('ROUTE_TO_CREATION', handle)
    return () => {
      appEmitter.off('ROUTE_TO_CREATION', handle)
    }
  }, [])

  function onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    if (event.detail.role === 'confirm') {
      // setMessage(`Hello, ${event.detail.data}!`)
    }
  }

  if (!creationId) return null

  return (
    <IonModal
      ref={modal}
      trigger="open-modal"
      onWillDismiss={(event) => onWillDismiss(event)}
    >
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
            <IonButton color="dark" onClick={() => modal.current?.dismiss()}>
              <XIcon size={20} />
            </IonButton>
          </IonButtons>
          {/* <IonTitle>Welcome</IonTitle> */}
          <IonButtons slot="end">
            <IonButton
              color="dark"
              onClick={() => {
                console.log('more.........')
              }}
            >
              <IonIcon icon={ellipsisHorizontal} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <MobileCreation creationId={creationId} />
      </IonContent>
    </IonModal>
  )
}
