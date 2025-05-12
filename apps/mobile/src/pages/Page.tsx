import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { LoginButton } from '@/components/Login/LoginButton'
import { MobileCreation } from '@/components/MobileCreation'
import { MobileHome } from '@/components/MobileHome'
import { SearchButton } from '@/components/MobileSearch/SearchButton'
import { Capacitor } from '@capacitor/core'
import { SocialLogin } from '@capgo/capacitor-social-login'
import { OverlayEventDetail } from '@ionic/core'
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { cog, ellipsisHorizontal } from 'ionicons/icons'
import { PlusIcon, XIcon } from 'lucide-react'
import {
  animate,
  AnimatePresence,
  motion,
  PanInfo,
  useMotionValue,
} from 'motion/react'
import { AreaDialog } from '@penx/components/AreaDialog'
import { QuickInput } from '@penx/components/QuickInput'
import { appEmitter } from '@penx/emitter'
import { useAddCreation } from '@penx/hooks/useAddCreation'
import { useArea } from '@penx/hooks/useArea'
import { ICreation } from '@penx/model-type'
import { store } from '@penx/store'
import { CreationType } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { Separator } from '@penx/uikit/separator'
import { cn } from '@penx/utils'
import ExploreContainer from '../components/ExploreContainer'
import { PageCreation } from './PageCreation'

const platform = Capacitor.getPlatform()

const Page: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { area } = useArea()
  const y = useMotionValue(0)

  const handleScroll = (event: CustomEvent) => {
    const scrollTop = event.detail.scrollTop
    setScrolled(scrollTop > 0)
  }

  useEffect(() => {
    SocialLogin.initialize({
      google: {
        iOSClientId:
          '864679274232-ijpm9pmvthvuhtoo77j387gudd1ibvii.apps.googleusercontent.com',
          webClientId: '864679274232-niev1df1dak216q5natclfvg5fhtp7fg.apps.googleusercontent.com'
      },
    })
  }, [])

  return (
    <IonPage className="">
      <AreaDialog />
      <IonHeader
        className={cn(platform === 'android' ? 'safe-area' : '')}
        style={{
          boxShadow: '0 0 0 rgba(0, 0, 0, 0.2)',
        }}
      >
        <IonToolbar
          className="toolbar"
          style={{
            // '--background': 'white',
            '--border-width': 0,
            // borderBottom: scrolled ? '1px solid #eeee' : 'none',
            // borderBottom: 'none',
            // border: 'none',
          }}
        >
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{area?.name}</IonTitle>

          <IonButtons slot="end" className="pr-2">
            <SearchButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="text-foreground">
        {/* <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{name}</IonTitle>
          </IonToolbar>
        </IonHeader> */}

        <div
          className="text-foreground relative flex flex-col px-1 pb-14"
          style={
            {
              '--background': 'oklch(1 0 0)',
            } as any
          }
        >
          <motion.div
            initial="closed"
            variants={{
              open: {
                // margin: 0,
                height: 'auto',
                opacity: 1,
                transition: {
                  duration: 0.2,
                },
              },
              closed: {
                height: 0,
                // marginTop: -110,
                opacity: 0,
                transition: {
                  duration: 0.2,
                },
              },
            }}
            animate={open ? 'open' : 'closed'}
            className={cn('flex rounded-2xl px-3', open && 'mb-2')}
          >
            <QuickInput onCancel={() => setOpen(false)} />
          </motion.div>

          <div className="">
            <MobileHome />
          </div>
        </div>
        <IonFab
          slot="fixed"
          vertical="bottom"
          className="flex w-full justify-center pb-5"
        >
          <Button
            size="icon"
            variant="ghost"
            className="border-foreground/4 size-13 text-foreground flex items-center gap-2 rounded-full border bg-white px-2 shadow-md dark:bg-neutral-800"
            onClick={async () => {
              setOpen(true)
              // const creation = await addCreation(CreationType.PAGE)
              // store.set(creationIdAtom, creation.id)
            }}
          >
            <PlusIcon size={26} />
          </Button>
        </IonFab>

        <PageCreation />
      </IonContent>
    </IonPage>
  )
}

export default Page
