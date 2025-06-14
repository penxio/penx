import React, { useEffect, useMemo, useRef, useState } from 'react'
import { IonContent, IonMenuToggle } from '@ionic/react'
import { useKeenSlider } from 'keen-slider/react'
import { motion } from 'motion/react'
import { JournalContent } from '@penx/components/DashboardLayout/panel-renderer/PanelJournal/JournalContent'
import { PanelList } from '@penx/components/DashboardLayout/PanelList'
import { usePanels } from '@penx/hooks/usePanels'
import { PanelType } from '@penx/types'
import { JournalTitleMobile } from './JournalTitleMobile'
import 'keen-slider/keen-slider.min.css'
import { isAndroid, isIOS } from '@/lib/utils'
import { Capacitor } from '@capacitor/core'
import { effect } from 'zod'
import { appEmitter } from '@penx/emitter'
import { useJournal } from '@penx/hooks/useJournal'
import { cn } from '@penx/utils'
import { HomeHeader } from './HomeHeader'

const platform = Capacitor.getPlatform()

interface Props {}

export const Journals = ({}: Props) => {
  const { panels } = usePanels()
  const { journal } = useJournal()
  const date = journal.date

  const pt = useMemo(() => {
    if (isAndroid) return 'calc(var(--safe-area-inset-top) + 8px)'
    if (isIOS) return 'calc(var(--safe-area-inset-top))'
    return 12
  }, [isAndroid, isIOS])

  return (
    <IonContent
      fullscreen
      className="text-foreground content"
      scrollEvents={true}
      onIonScroll={async (event) => {
        const scrollTop = event.detail.scrollTop
        // setScrolled(scrollTop > 0)

        // if (Capacitor.getPlatform() === 'android') {
        // }
        // SafeArea.enable({
        //   config: {
        //     customColorsForSystemBars: true,
        //     statusBarColor:
        //       scrollTop > 0
        //         ? isDark
        //           ? '#ffffff'
        //           : '#ffffff'
        //         : '#00000000',
        //     statusBarContent: isDark ? 'light' : 'dark',
        //     navigationBarColor: '#00000000', // transparent
        //     navigationBarContent: isDark ? 'light' : 'dark',
        //   },
        // })
      }}
    >
      <div
        className="fixed left-0 right-0 top-0 z-50"
        style={{
          height: 'calc(var(--safe-area-inset-top) + 2px)',
          background:
            'linear-gradient(to bottom, #f1e4e3 20%, transparent 100%)',
        }}
      ></div>

      <div
        className={cn(
          'text-foreground relative flex flex-col gap-3 px-3 pb-32',
        )}
        style={
          {
            '--background': 'oklch(1 0 0)',
            paddingTop: pt,
          } as any
        }
      >
        <HomeHeader />
        <JournalContent
          date={date}
          showJournalTitle={false}
          // journalTitle={
          //   <div className="-mr-2 flex items-center justify-between">
          //     <div className="flex items-center gap-1">
          //       <IonMenuToggle className="flex items-center">
          //         <span className="icon-[heroicons-outline--menu-alt-2] size-6"></span>
          //       </IonMenuToggle>
          //       <JournalTitleMobile initialDate={new Date(date)} />
          //     </div>
          //     <SearchButton />
          //   </div>
          // }
        />
      </div>

      {/* <div
        className="fixed bottom-0 left-0 right-0 top-0 z-[-1]"
        style={{
          backgroundSize: 'cover',
          backgroundImage:
            'https://images.unsplash.com/photo-1633169621790-71e519cfb42d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        }}
      ></div> */}
      <div
        className="fixed bottom-0 left-0 right-0 top-0 z-[-1] opacity-40 dark:opacity-0"
        style={{
          filter: 'blur(150px) saturate(150%)',
          transform: 'translateZ(0)',
          backgroundImage:
            'radial-gradient(at 27% 37%, #eea5ba 0, transparent 50%), radial-gradient(at 97% 21%, #fd3a4e 0, transparent 50%), radial-gradient(at 52% 99%, #e4c795 0, transparent 50%), radial-gradient(at 10% 29%, #5afc7d 0, transparent 50%), radial-gradient(at 97% 96%, #8ca8e8 0, transparent 50%), radial-gradient(at 33% 50%, #9772fe 0, transparent 50%), radial-gradient(at 79% 53%, #3a8bfd 0, transparent 50%)',
        }}
      ></div>
    </IonContent>
  )
}
