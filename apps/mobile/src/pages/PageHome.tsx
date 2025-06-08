import React, { useEffect, useRef, useState } from 'react'
import { AnimatedJournalInput } from '@/components/AnimatedJournalInput'
import { Footer } from '@/components/Footer/Footer'
import { HomeHeader } from '@/components/HomeHeader'
import { GoogleLoginButton } from '@/components/Login/GoogleLoginButton'
import { useMoreStructDrawer } from '@/components/MoreStructDrawer/useMoreStructDrawer'
import { useTheme } from '@/components/theme-provider'
import { useKeyboard, useKeyboardChange } from '@/hooks/useKeyboard'
import { mainBackgroundLight } from '@/lib/constants'
import { DarkMode } from '@aparajita/capacitor-dark-mode'
import { SafeArea } from '@capacitor-community/safe-area'
import { Capacitor } from '@capacitor/core'
import { IonContent } from '@ionic/react'
import { useQuery } from '@tanstack/react-query'
import { PanelList } from '@penx/components/DashboardLayout/PanelList'
import { usePanels } from '@penx/hooks/usePanels'
import { PanelType } from '@penx/types'

const platform = Capacitor.getPlatform()

const PageHome = ({ nav }: any) => {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { panels } = usePanels()

  const { height, isShow, setState } = useKeyboard()
  useKeyboardChange()
  const { isDark } = useTheme()

  // const { data: isDark } = useQuery({
  //   queryKey: ['isDark'],
  //   queryFn: async () => {
  //     const mode = await DarkMode.isDarkMode()
  //     return mode.dark
  //   },
  // })

  useEffect(() => {
    if (!isShow && open) setOpen(false)
  }, [isShow])

  return (
    <>
      <AnimatedJournalInput open={open} setOpen={setOpen} />
      <HomeHeader scrolled={scrolled} />

      <IonContent
        fullscreen
        className="text-foreground content relative"
        scrollEvents={true}
        onIonScroll={async (event) => {
          const scrollTop = event.detail.scrollTop
          setScrolled(scrollTop > 0)

          // if (Capacitor.getPlatform() === 'android') {
          // }
          SafeArea.enable({
            config: {
              customColorsForSystemBars: true,
              statusBarColor:
                scrollTop > 0 ? (isDark ? '#ffffff' : '#ffffff') : '#00000000',
              statusBarContent: isDark ? 'light' : 'dark',
              navigationBarColor: '#00000000', // transparent
              navigationBarContent: isDark ? 'light' : 'dark',
            },
          })
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
