import React, { useEffect, useRef, useState } from 'react'
import { Footer } from '@/components/Footer'
import { MobileHome } from '@/components/MobileHome'
import { SearchButton } from '@/components/MobileSearch/SearchButton'
import { MobileTask } from '@/components/MobileTask/MobileTask'
import { useHomeTab } from '@/hooks/useHomeTab'
import { Capacitor } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen'
import { SocialLogin } from '@capgo/capacitor-social-login'
import { OverlayEventDetail } from '@ionic/core'
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFooter,
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
import { PageCreation } from './PageCreation'

const platform = Capacitor.getPlatform()

const PageHome: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { area } = useArea()
  const y = useMotionValue(0)
  const { isHome, type, setType } = useHomeTab()

  const inputRef = useRef<HTMLTextAreaElement>(null)

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

      {open && (
        <div
          // initial="closed"
          // variants={{
          //   open: {
          //     opacity: 1,
          //     display: 'block',
          //     transition: {
          //       duration: 0.2,
          //     },
          //   },
          //   closed: {
          //     opacity: 0,
          //     display: 'none',
          //     transition: {
          //       duration: 0.2,
          //     },
          //   },
          // }}
          // animate={open ? 'open' : 'closed'}
          className={cn(
            'bg-background/50 fixed bottom-0 left-0 right-0 top-0 z-[10000] blur-sm',
          )}
          onClick={() => {
            //
            setOpen(false)
          }}
        ></div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial="closed"
            exit="closed"
            variants={{
              open: {
                height: 'auto',
                // translateY: 80,
                // opacity: 1,
                top: 60,
                transition: {
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                  // mass: 0.5,
                  // duration: 0.1,
                },
              },
              closed: {
                // translateY: '-140%',
                // opacity: 0,
                top: -200,
                transition: {
                  type: 'tween',
                  // duration: 0.2,
                },
              },
            }}
            animate={open ? 'open' : 'closed'}
            className={cn(
              'fixed z-[10000000] mx-auto flex w-[100vw] flex-col bg-transparent',
              open && 'mb-2',
            )}
          >
            <div className="mx-auto w-[90vw] flex-1">
              <QuickInput
                isColorful={false}
                ref={inputRef}
                onCancel={() => setOpen(false)}
                afterSubmit={() => {
                  setOpen(false)
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <IonHeader
        className={cn(platform === 'android' ? 'safe-area' : '')}
        style={{
          boxShadow: '0 0 0 rgba(0, 0, 0, 0.2)',
        }}
      >
        <IonToolbar
          className="toolbar px-3 "
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
          <div className="">
            {isHome && <MobileHome />}
            {!isHome && <MobileTask />}
          </div>
        </div>

        <PageCreation />
      </IonContent>
      <Footer
        onAdd={() => {
          setOpen(true)
          setTimeout(() => {
            inputRef.current?.focus()
          }, 0)
        }}
      />
    </IonPage>
  )
}

export default PageHome
