import React, { useEffect, useRef, useState } from 'react'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { MobileHome } from '@/components/MobileHome'
import { SearchButton } from '@/components/MobileSearch/SearchButton'
import { MobileTask } from '@/components/MobileTask/MobileTask'
import { LoginContent } from '@/components/Profile/LoginContent'
import { ProfileContent } from '@/components/Profile/ProfileContent'
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
import { PanelList } from '@penx/components/DashboardLayout/PanelList'
import { QuickInput } from '@penx/components/QuickInput'
import { appEmitter } from '@penx/emitter'
import { useArea } from '@penx/hooks/useArea'
import { useCreationId } from '@penx/hooks/useCreationId'
import { ICreationNode } from '@penx/model-type'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/button'
import { Separator } from '@penx/uikit/separator'
import { SidebarProvider } from '@penx/uikit/ui/sidebar'
import { cn } from '@penx/utils'
import { PageCreation } from './PageCreation'

const platform = Capacitor.getPlatform()

const PageHome: React.FC = ({ nav }: any) => {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { area } = useArea()
  const y = useMotionValue(0)
  const { isHome, type, setType } = useHomeTab()
  const { session } = useSession()

  const inputRef = useRef<HTMLTextAreaElement>(null)

  const { creationId, setCreationId } = useCreationId()

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
    <>
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
      <Header />

      <IonContent fullscreen className="text-foreground content">
        {/* <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{name}</IonTitle>
          </IonToolbar>
        </IonHeader> */}

        <div id="portal" className="fixed left-0 top-0 z-[10]" />

        <div
          className="text-foreground z-1 relative flex min-h-full flex-col px-1"
          style={
            {
              '--background': 'oklch(1 0 0)',
            } as any
          }
        >
          {/* <SidebarProvider>
          </SidebarProvider> */}

          <PanelList />
          {/* {type === 'HOME' && <MobileHome />} */}
          {/* {type === 'TASK' && <MobileTask />} */}
          {/* {type === 'PROFILE' &&
            (session ? <ProfileContent /> : <LoginContent />)} */}
        </div>
      </IonContent>

      <Footer
        onAdd={() => {
          setOpen(true)
          setTimeout(() => {
            inputRef.current?.focus()
          }, 0)
        }}
      />
    </>
  )
}

export default PageHome
