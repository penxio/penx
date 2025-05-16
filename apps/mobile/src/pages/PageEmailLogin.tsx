import React from 'react'
import { Capacitor } from '@capacitor/core'
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonNavLink,
  IonTitle,
  IonToolbar,
} from '@ionic/react'

const platform = Capacitor.getPlatform()

export function PageEmailLogin() {
  return (
    <>
      <IonHeader
        className={platform === 'android' ? 'safe-area' : ''}
        style={
          {
            boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
          }
        }
      >
        <IonToolbar
          className="toolbar"
          style={
            {
              '--border-width': 0,
              // borderBottom: scrolled ? '1px solid #eeee' : 'none',
              // borderBottom: 'none',
              // border: 'none',
            }
          }
        >
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>Page Two</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <h1>Page Two</h1>
        {/* <IonNavLink routerDirection="forward" component={() => <PageThree />}>
          <IonButton>Go to Page Three</IonButton>
        </IonNavLink> */}
      </IonContent>
    </>
  )
}
