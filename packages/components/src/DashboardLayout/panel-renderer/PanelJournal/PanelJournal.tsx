'use client'

import { Trans } from '@lingui/react'
import { PlusIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { AreaInfo } from '@penx/components/AreaInfo'
import { isMobileApp } from '@penx/constants'
import { useArea } from '@penx/hooks/useArea'
import { updateCreationProps } from '@penx/hooks/useCreation'
import { useCreations } from '@penx/hooks/useCreations'
import { useStructs } from '@penx/hooks/useStructs'
import { store } from '@penx/store'
import { Panel, PanelType, StructType } from '@penx/types'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'
import { JournalQuickInput } from '../../../JournalQuickInput'
import { ClosePanelButton } from '../../ClosePanelButton'
import { PanelHeaderWrapper } from '../../PanelHeaderWrapper'
import { JournalContent } from './JournalContent'

interface Props {
  panel: Panel
  index: number
}

export function PanelJournal({ panel, index }: Props) {
  const { area } = useArea()
  if (!area) return null
  if (isMobileApp) {
    return (
      <div className="px-3">
        <JournalContent date={panel.date!} />
      </div>
    )
  }
  return (
    <>
      <PanelHeaderWrapper index={index}>
        <div>Journals</div>
        <ClosePanelButton panel={panel} />
      </PanelHeaderWrapper>

      <div className="relative flex-1">
        <div className="absolute bottom-0 left-0 right-0 top-0  flex h-full flex-1 flex-col">
          <div
            className={cn(
              'relative z-50 flex w-full flex-1 flex-col overflow-auto px-6 pb-20 pt-6',
            )}
          >
            <JournalContent date={panel.date!} />
          </div>
          {!isMobileApp && (
            <div className="relative z-50 px-6 pb-6">
              <div className="sticky bottom-0 mx-auto flex w-full max-w-xl flex-col items-center justify-center gap-2">
                <JournalQuickInput />
              </div>
            </div>
          )}

          {/* <div className="bg-background absolute bottom-0 left-0 right-0 top-0 z-[11] h-full"></div> */}

          <div
            className="absolute bottom-0 left-0 right-0 top-0 z-10 opacity-30 dark:opacity-0"
            style={{
              filter: 'blur(150px) saturate(150%)',
              transform: 'translateZ(0)',
              backgroundImage:
                'radial-gradient(at 27% 37%, #3a8bfd 0, transparent 50%), radial-gradient(at 97% 21%, #9772fe 0, transparent 50%), radial-gradient(at 52% 99%, #fd3a4e 0, transparent 50%), radial-gradient(at 10% 29%, #5afc7d 0, transparent 50%), radial-gradient(at 97% 96%, #e4c795 0, transparent 50%), radial-gradient(at 33% 50%, #8ca8e8 0, transparent 50%), radial-gradient(at 79% 53%, #eea5ba 0, transparent 50%)',
            }}
          ></div>
        </div>
      </div>
    </>
  )
}
