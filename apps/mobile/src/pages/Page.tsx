import React, { useEffect, useRef, useState } from 'react'
import { MobileHome } from '@/components/MobileHome'
import { SearchButton } from '@/components/MobileSearch/SearchButton'
import { MobileTask } from '@/components/MobileTask/MobileTask'
import { useHomeTab } from '@/hooks/useHomeTab'
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
  IonMenuToggle,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { cog, ellipsisHorizontal } from 'ionicons/icons'
import { LayersIcon, PlusIcon, XIcon } from 'lucide-react'
import {
  animate,
  AnimatePresence,
  motion,
  PanInfo,
  useMotionValue,
} from 'motion/react'
import { EditWidgetButton } from '@penx/components/area-widgets/EditWidget/EditWidgetButton'
import { AreaDialog } from '@penx/components/AreaDialog'
import { QuickInput } from '@penx/components/QuickInput'
import { appEmitter } from '@penx/emitter'
import { useArea } from '@penx/hooks/useArea'
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
  const { isHome, setType } = useHomeTab()

  const handleScroll = (event: CustomEvent) => {
    const scrollTop = event.detail.scrollTop
    setScrolled(scrollTop > 0)
  }

  useEffect(() => {
    SocialLogin.initialize({
      apple: {},
      google: {
        iOSClientId:
          '864679274232-ijpm9pmvthvuhtoo77j387gudd1ibvii.apps.googleusercontent.com',
        webClientId:
          '864679274232-niev1df1dak216q5natclfvg5fhtp7fg.apps.googleusercontent.com',
      },
    })
  }, [])

  return (
    <IonPage className="">
      <AreaDialog />
      <IonHeader
        className={cn('px-3', platform === 'android' ? 'safe-area' : '')}
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
            <IonMenuToggle>
              <span className="icon-[heroicons-outline--menu-alt-2] size-6"></span>
            </IonMenuToggle>
          </IonButtons>

          <IonTitle slot="center" className="mx-1">
            {area?.name}
          </IonTitle>

          <IonButtons slot="end" className="">
            <SearchButton />
            <EditWidgetButton />
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
            {isHome && <MobileHome />}
            {!isHome && <MobileTask />}
          </div>
        </div>

        <IonFab
          slot="fixed"
          vertical="bottom"
          className="flex w-full justify-center pb-6"
        >
          <div className="border-foreground/4 bg-background flex h-14 items-center gap-3 rounded-full border px-3 shadow-md dark:bg-neutral-900">
            <Button
              size="icon"
              variant="ghost"
              className={cn('size-8 rounded-full')}
              onClick={async () => {
                setType('HOME')
              }}
            >
              {!isHome && (
                <span className="icon-[fluent--home-20-regular] size-7"></span>
              )}
              {isHome && (
                <span className="icon-[fluent--home-20-filled] size-7"></span>
              )}
            </Button>
            {/* <Separator orientation="vertical" className="h-4" /> */}
            <Button
              size="icon"
              variant="ghost"
              className="text-background bg-foreground size-9 rounded-full"
              onClick={async () => {
                setOpen(true)
              }}
            >
              <PlusIcon size={24} />
            </Button>
            {/* <Separator orientation="vertical" className="bg-foreground/50 h-4" /> */}
            <Button
              size="icon"
              variant="ghost"
              className={cn('size-8 rounded-full')}
              onClick={async () => {
                setType('TASK')
              }}
            >
              {isHome && (
                <span className="icon-[fluent--checkbox-checked-20-regular] size-7"></span>
              )}
              {!isHome && (
                <span className="icon-[fluent--checkbox-checked-20-filled] size-7"></span>
              )}
            </Button>
          </div>
        </IonFab>

        <PageCreation />
      </IonContent>
    </IonPage>
  )
}

export default Page
