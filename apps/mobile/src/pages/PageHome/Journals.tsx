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
import { GuideEntry } from './GuideEntry'
import { HomeHeader } from './HomeHeader'

const platform = Capacitor.getPlatform()

interface Props {}

export const Journals = ({}: Props) => {
  const { panels } = usePanels()
  const { journal } = useJournal()
  const date = journal.date

  return (
    <>
      {/* <HomeHeader /> */}
      <GuideEntry />
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
    </>
  )
}
