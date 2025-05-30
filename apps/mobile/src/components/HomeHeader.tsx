import React, { useMemo } from 'react'
import { SearchButton } from '@/components/MobileSearch/SearchButton'
import { isAndroid } from '@/lib/utils'
import { Capacitor } from '@capacitor/core'
import { IonButtons, IonHeader, IonMenuToggle, IonToolbar } from '@ionic/react'
import { cn } from '@penx/utils'
import { StructTypeSelect } from './StructTypeSelect'
import { useTheme } from './theme-provider'

interface Props {
  scrolled: boolean
}

export const HomeHeader = ({ scrolled }: Props) => {
  const { isDark } = useTheme()
  const bg = isDark ? '#222' : '#fff'
  const border = isDark ? '1px solid #222' : '1px solid #eeee'
  return (
    <IonHeader
      className={cn(isAndroid && 'safe-area')}
      style={{ boxShadow: '0 0 0 rgba(0, 0, 0, 0.2)' }}
    >
      <IonToolbar
        className="relative flex items-center p-0 px-3 transition-all duration-300 ease-in-out"
        style={{
          '--border-width': 0,
          // '--background': 'transparent',
          '--background': scrolled ? bg : 'transparent',
          // borderBottom: scrolled ? border : 'none',
        }}
      >
        <IonButtons slot="start">
          <IonMenuToggle className="flex items-center">
            <span className="icon-[heroicons-outline--menu-alt-2] size-6"></span>
          </IonMenuToggle>
        </IonButtons>

        <div className="text-foreground/50 text-md h-ful scroll-container flex flex-1 items-center gap-1 overflow-auto px-2 ">
          <StructTypeSelect className="" />
        </div>

        <IonButtons slot="end" className="">
          <SearchButton />
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  )
}
