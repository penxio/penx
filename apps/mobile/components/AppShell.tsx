'use client'

import { useEffect, useRef, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Redirect, Route } from 'react-router-dom'
import { PageHome } from '@/components/pages/PageHome'
import { StatusBar, Style } from '@capacitor/status-bar'
import {
  IonApp,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonNav,
  IonPage,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
  setupIonicReact,
  useIonRouter,
} from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { notificationsOutline } from 'ionicons/icons'
import { isBrowser } from '@penx/constants'
import { appEmitter } from '@penx/emitter'
import { ICreation } from '@penx/model-type'
import { MobileHome } from './MobileHome'
import { PageDetail } from './pages/PageDetail'

setupIonicReact({})

StatusBar.setOverlaysWebView({ overlay: false })
// StatusBar.setBackgroundColor()

const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')

await StatusBar.setStyle({
  style: prefersDarkScheme.matches ? Style.Dark : Style.Light,
})

prefersDarkScheme.addEventListener('change', async (status) => {
  try {
    await StatusBar.setStyle({
      style: status.matches ? Style.Dark : Style.Light,
    })
  } catch {}
})

if (isBrowser) {
}

export const AppShell = () => {
  const [showNotifications, setShowNotifications] = useState(false)
  const nav = useRef<HTMLIonNavElement>(null)

  const initRef = useRef(false)
  useEffect(() => {
    // if (initRef.current) return
    // initRef.current = true
    function handle(creation: ICreation) {
      console.log('handle route to creation: ', creation.id)

      nav.current?.push(PageDetail, { id: creation.id, title: 'Page creation' })
    }

    appEmitter.on('ROUTE_TO_CREATION', handle)
    return () => {
      appEmitter.off('ROUTE_TO_CREATION', handle)
    }
  }, [])

  return (
    <IonApp>
      <IonPage>
        <DndProvider backend={HTML5Backend}>
          <IonNav ref={nav} root={() => <PageHome />}></IonNav>
        </DndProvider>
      </IonPage>
    </IonApp>
  )
}

export default AppShell
