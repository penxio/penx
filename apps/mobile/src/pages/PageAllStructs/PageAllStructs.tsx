import React, { useEffect, useRef, useState } from 'react'
import { AllStructsHeader } from '@/components/AllStructsHeader'
import { StructHeader } from '@/components/StructHeader'
import { mainBackgroundLight } from '@/lib/constants'
import { DarkMode } from '@aparajita/capacitor-dark-mode'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import { IonContent, IonPage } from '@ionic/react'
import { Trans } from '@lingui/react/macro'
import { useQuery } from '@tanstack/react-query'
import { PanelList } from '@penx/components/DashboardLayout/PanelList'
import { usePanels } from '@penx/hooks/usePanels'
import { PanelType } from '@penx/types'
import { CreateStructButton } from './CreateStructButton'
import { StructList } from './StructList'
import { StructMarketplace } from './StructMarketplace'
import { NavType, StructNav } from './StructNav'

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

  const [navType, setNavType] = useState(NavType.MY_STRUCT)

  return (
    <IonContent
      fullscreen
      className="text-foreground content ion-padding"
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
        className="text-foreground z-1 relative flex flex-col gap-3"
        style={
          {
            '--background': 'oklch(1 0 0)',
          } as any
        }
      >
        <StructNav navType={navType} onSelect={(v) => setNavType(v)} />
        {navType === NavType.MY_STRUCT && (
          <div className="flex flex-col gap-4">
            <CreateStructButton />
            <StructList />
          </div>
        )}
        {navType === NavType.MARKETPLACE && <StructMarketplace />}
      </div>
    </IonContent>
  )
}
