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
import {
  animate,
  AnimatePresence,
  motion,
  PanInfo,
  useMotionValue,
} from 'motion/react'
import { AreaDialog } from '@penx/components/AreaDialog'
import { QuickInput } from '@penx/components/QuickInput'
import { useAddCreation } from '@penx/hooks/useAddCreation'
import { store } from '@penx/store'
import { CreationType } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { Separator } from '@penx/uikit/separator'
import { cn } from '@penx/utils'
import { LoginButton } from '../Login/LoginButton'
import { MobileHome } from '../MobileHome'
import { SearchButton } from '../MobileSearch/SearchButton'

export function PageHome() {
  const addCreation = useAddCreation()
  const modal = useRef<HTMLIonModalElement>(null)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const handleScroll = (event: CustomEvent) => {
    const scrollTop = event.detail.scrollTop
    setScrolled(scrollTop > 0)
  }

  useEffect(() => {
    SocialLogin.initialize({
      google: {
        iOSClientId:
          '864679274232-ijpm9pmvthvuhtoo77j387gudd1ibvii.apps.googleusercontent.com',
      },
    })
  }, [])

  const y = useMotionValue(0)
  // const [status, setStatus] = useState(STATUS.IDLE)

  return (
    <>
      <AreaDialog />
      <IonHeader
        style={{
          boxShadow: '0 0 0 rgba(0, 0, 0, 0.2)',
        }}
      >
        <IonToolbar
          style={{
            '--background': 'white',
            '--border-width': 0,
            // borderBottom: scrolled ? '1px solid #eeee' : 'none',
            // borderBottom: 'none',
            // border: 'none',
          }}
        >
          <IonTitle slot="" class="pl-3">
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
        onIonScroll={handleScroll}
        scrollEvents
        style={
          {
            // '--background': 'antiquewhite',
            // '--background': '#f0f0f0',
          }
        }
      >
        <div
          className="relative flex flex-col pb-14"
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
            className={cn('flex rounded-2xl', open && 'mb-2')}
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
          <div className="border-foreground/4 h-13 flex items-center gap-2 rounded-full border bg-white px-2 shadow-md">
            <SearchButton />
            <Separator orientation="vertical" className="h-4" />{' '}
            <Button
              size="icon"
              variant="ghost"
              className="size-9 rounded-full"
              onClick={async () => {
                setOpen(true)
                // const creation = await addCreation(CreationType.PAGE)
                // store.set(creationIdAtom, creation.id)
              }}
            >
              <PlusIcon size={26} />
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <LoginButton />
          </div>
        </IonFab>
      </IonContent>
    </>
  )
}
