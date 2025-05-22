import React, { useEffect, useRef, useState } from 'react'
import { StructHeader } from '@/components/StructHeader'
import { DarkMode } from '@aparajita/capacitor-dark-mode'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import { IonContent } from '@ionic/react'
import { useQuery } from '@tanstack/react-query'
import { PanelList } from '@penx/components/DashboardLayout/PanelList'
import { usePanels } from '@penx/hooks/usePanels'
import { PanelType } from '@penx/types'
import { cn } from '@penx/utils'

const platform = Capacitor.getPlatform()

export const PageStruct: React.FC = ({ nav }: any) => {
  return (
    <>
      <StructHeader />
      <Content></Content>
    </>
  )
}

function Content() {
  const { panels } = usePanels()

  const { data: isDark } = useQuery({
    queryKey: ['isDark'],
    queryFn: async () => {
      const mode = await DarkMode.isDarkMode()
      return mode.dark
    },
  })
  return (
    <IonContent
      fullscreen
      className="text-foreground content"
      scrollEvents={true}
      onIonScroll={async (event) => {
        const scrollTop = event.detail.scrollTop

        if (Capacitor.getPlatform() === 'android') {
          if (scrollTop > 0) {
            await StatusBar.setBackgroundColor({
              color: isDark ? '#222' : '#f9f9f9',
            })
          } else {
            await StatusBar.setBackgroundColor({
              color: '#00000000',
            })
          }
        }
      }}
    >
      <div id="portal" className="fixed left-0 top-0 z-[10]" />
      <div
        className="text-foreground z-1 relative flex flex-col px-1"
        style={
          {
            '--background': 'oklch(1 0 0)',
          } as any
        }
      >
        <PanelList panels={panels.filter((p) => p.type === PanelType.STRUCT)} />
      </div>
    </IonContent>
  )
}
