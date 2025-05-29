import React, { useEffect, useRef, useState } from 'react'
import { Footer } from '@/components/Footer'
import { HomeHeader } from '@/components/HomeHeader'
import { useMoreStructDrawer } from '@/components/MoreStructDrawer/useMoreStructDrawer'
import { GoogleLoginButton } from '@/components/Profile/GoogleLoginButton'
import { useKeyboard, useKeyboardChange } from '@/hooks/useKeyboard'
import { mainBackgroundLight } from '@/lib/constants'
import { DarkMode } from '@aparajita/capacitor-dark-mode'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import { IonContent } from '@ionic/react'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'motion/react'
import { AreaDialog } from '@penx/components/AreaDialog'
import { PanelList } from '@penx/components/DashboardLayout/PanelList'
import { JournalQuickInput } from '@penx/components/JournalQuickInput'
import { usePanels } from '@penx/hooks/usePanels'
import { PanelType } from '@penx/types'
import { cn } from '@penx/utils'

const platform = Capacitor.getPlatform()

const PageHome = ({ nav }: any) => {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { panels } = usePanels()

  const { height, isShow, setState } = useKeyboard()
  useKeyboardChange()

  const { data: isDark } = useQuery({
    queryKey: ['isDark'],
    queryFn: async () => {
      const mode = await DarkMode.isDarkMode()
      return mode.dark
    },
  })

  useEffect(() => {
    if (!isShow && open) setOpen(false)
  }, [isShow])

  return (
    <>
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
                bottom: platform === 'ios' ? height + 20 : 20,
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
                bottom: platform === 'ios' ? -height : -300,
                // bottom: 0,
                transition: {
                  // type: 'tween',
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
            <div className="mx-auto w-[92vw] flex-1">
              <JournalQuickInput
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
      <HomeHeader />

      <IonContent
        fullscreen
        className="text-foreground content relative"
        scrollEvents={true}
        onIonScroll={async (event) => {
          const scrollTop = event.detail.scrollTop
          setScrolled(scrollTop > 0)

          if (Capacitor.getPlatform() === 'android') {
            if (scrollTop > 0) {
              await StatusBar.setBackgroundColor({
                color: isDark ? '#222' : mainBackgroundLight,
              })
            } else {
              await StatusBar.setBackgroundColor({
                color: '#00000000',
              })
            }
          }
        }}
      >
        <div
          className="text-foreground relative flex flex-col px-1 pb-32 pt-4"
          style={
            {
              '--background': 'oklch(1 0 0)',
            } as any
          }
        >
          <PanelList
            panels={panels.filter((p) => p.type === PanelType.JOURNAL)}
          />
          {/* {type === 'TASK' && <MobileTask />} */}
          {/* {type === 'PROFILE' &&
            (session ? <ProfileContent /> : <LoginContent />)} */}
        </div>

        <div
          className="fixed bottom-0 left-0 right-0 top-0 z-[-1] opacity-30 dark:opacity-0"
          style={{
            filter: 'blur(150px) saturate(150%)',
            transform: 'translateZ(0)',
            backgroundImage:
              'radial-gradient(at 27% 37%, #eea5ba 0, transparent 50%), radial-gradient(at 97% 21%, #fd3a4e 0, transparent 50%), radial-gradient(at 52% 99%, #e4c795 0, transparent 50%), radial-gradient(at 10% 29%, #5afc7d 0, transparent 50%), radial-gradient(at 97% 96%, #8ca8e8 0, transparent 50%), radial-gradient(at 33% 50%, #9772fe 0, transparent 50%), radial-gradient(at 79% 53%, #3a8bfd 0, transparent 50%)',
          }}
        ></div>
      </IonContent>

      <Footer
        open={open}
        onAdd={() => {
          // setState({
          //   height: 300,
          //   isShow: true,
          // })
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
