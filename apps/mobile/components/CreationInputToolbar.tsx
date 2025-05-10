import React, { useEffect, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Keyboard } from '@capacitor/keyboard'
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonIcon,
  IonInput,
  IonToolbar,
} from '@ionic/react'
import { send } from 'ionicons/icons'

export const CreationInputToolbar: React.FC = () => {
  return (
    <>
      <IonFooter className="" style={{}}>
        {/* <IonToolbar>
        </IonToolbar> */}
        <div className="h-10 bg-amber-400">this toolbar</div>
      </IonFooter>
    </>
  )
}
