import React, { useEffect, useRef, useState } from 'react'
import { AllStructsHeader } from '@/components/AllStructsHeader'
import { StructHeader } from '@/components/StructHeader'
import { mainBackgroundLight } from '@/lib/constants'
import { DarkMode } from '@aparajita/capacitor-dark-mode'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import { IonContent } from '@ionic/react'
import { useQuery } from '@tanstack/react-query'
import { PanelList } from '@penx/components/DashboardLayout/PanelList'
import { usePanels } from '@penx/hooks/usePanels'
import { PanelType } from '@penx/types'

const platform = Capacitor.getPlatform()

export const PageAllStructs: React.FC = ({ nav }: any) => {
  return (
    <>
      <AllStructsHeader />
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
        className="text-foreground z-1 relative flex flex-col px-1"
        style={
          {
            '--background': 'oklch(1 0 0)',
          } as any
        }
      >
        <PanelList
          panels={panels.filter((p) => p.type === PanelType.ALL_STRUCTS)}
        />
      </div>
    </IonContent>
  )
}
