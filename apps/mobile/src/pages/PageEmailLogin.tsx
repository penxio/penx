import React from 'react'
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

export function PageEmailLogin() {
  return (
    <>
      <IonHeader>
        <IonToolbar>
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

