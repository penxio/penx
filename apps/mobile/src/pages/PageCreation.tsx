import React, { useEffect, useRef, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { CreationMenu } from '@/components/CreationMenu'
import { MobileContent } from '@/components/MobileContent'
import { MobileCreation } from '@/components/MobileCreation'
import { MobileHeaderWrapper } from '@/components/MobileHeaderWrapper'
import { TaskCreation } from '@/components/TaskCreation/TaskCreation'
import { mainBackgroundLight } from '@/lib/constants'
import { isAndroid } from '@/lib/utils'
import { Capacitor } from '@capacitor/core'
import {
  PanelCreationProvider,
  usePanelCreationContext,
} from '@penx/components/Creation/PanelCreationProvider'

interface Props {
  creationId: string
  nav: HTMLIonNavElement
}

export const PageCreation = ({ creationId, nav }: Props) => {
  return (
    <PanelCreationProvider creationId={creationId}>
      <Content creationId={creationId} nav={nav} />
    </PanelCreationProvider>
  )
}

function Content({ creationId, nav }: Props) {
  const creation = usePanelCreationContext()

  return (
    <MobileContent
      backgroundColor={creation.isTask ? '#fff' : mainBackgroundLight}
      rightSlot={
        <CreationMenu
          creationId={creationId}
          afterDelete={() => {
            nav.pop()
          }}
        />
      }
    >
      {creation.isTask ? <TaskCreation /> : <MobileCreation />}
    </MobileContent>
  )
}
