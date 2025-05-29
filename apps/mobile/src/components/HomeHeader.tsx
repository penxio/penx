import React, { useMemo } from 'react'
import { SearchButton } from '@/components/MobileSearch/SearchButton'
import { Capacitor } from '@capacitor/core'
import { IonButtons, IonHeader, IonMenuToggle, IonToolbar } from '@ionic/react'
import { motion } from 'motion/react'
import { cn } from '@penx/utils'
import { StructTypeSelect } from './StructTypeSelect'

const platform = Capacitor.getPlatform()

interface Props {
  scrolled: boolean
}

export const HomeHeader = ({ scrolled }: Props) => {
  console.log('=====scrolled:', scrolled)

  return (
    <IonHeader
      className={cn(platform === 'android' ? 'safe-area' : '')}
      style={{
        boxShadow: '0 0 0 rgba(0, 0, 0, 0.2)',
      }}
    >
      <IonToolbar
        className="relative flex p-0 transition-all duration-300 ease-in-out"
        style={{
          '--background': 'transparent',
          // '--background': scrolled ? '#fff' : 'transparent',
          // borderBottom: scrolled ? '1px solid #eeee' : 'none',
        }}
      >
        <motion.div
          initial="inactive"
          animate={{
            backgroundColor: scrolled ? '#fff' : 'transparent',
            borderBottom: scrolled
              ? '1px solid #eeee'
              : '0px solid transparent',
            boxShadow: scrolled
              ? '0 2px 4px rgba(0,0,0,0.1)'
              : '0 0 0 rgba(0,0,0,0)',
          }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
          // animate={scrolled ? 'active' : 'inactive'}
          // exit="inactive"
          // variants={{
          //   active: {
          //     backgroundColor: '#fff',
          //     transition: { duration: 0.3, ease: 'easeInOut' },
          //   },
          //   inactive: {
          //     backgroundColor: 'transparent',
          //     transition: { duration: 0.3, ease: 'easeInOut' },
          //   },
          // }}
          className="absolute bottom-0 top-0 flex h-full w-full flex-1 items-center pl-3"
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
        </motion.div>
      </IonToolbar>
    </IonHeader>
  )
}
