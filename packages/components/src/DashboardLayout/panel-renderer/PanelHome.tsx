'use client'

import { Trans } from '@lingui/react'
import { motion } from 'motion/react'
import { AreaInfo } from '@penx/components/AreaInfo'
import { useArea } from '@penx/hooks/useArea'
import { updateCreation } from '@penx/hooks/useCreation'
import { useCreations } from '@penx/hooks/useCreations'
import { useMolds } from '@penx/hooks/useMolds'
import { store } from '@penx/store'
import { CreationType, Panel, PanelType } from '@penx/types'
import { ClosePanelButton } from '../ClosePanelButton'
import { PanelHeaderWrapper } from '../PanelHeaderWrapper'

interface Props {
  panel: Panel
  index: number
}

export function PanelHome({ panel, index }: Props) {
  const { area } = useArea()
  if (!area) return null
  return (
    <>
      <PanelHeaderWrapper index={index}>
        <div></div>
        <ClosePanelButton panel={panel} />
      </PanelHeaderWrapper>

      <div className="flex h-full justify-between overflow-hidden px-4 pt-20">
        <div
          key="overview"
          className="mx-auto -mt-40 flex size-full flex-col items-center justify-center space-y-3 px-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-semibold"
          >
            Hello there!
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.6 }}
            className="text-2xl text-zinc-500"
          >
            Welcome to{' '}
            <span className="text-foreground font-bold">{area.name}</span>
          </motion.div>
        </div>
      </div>
    </>
  )
}
