'use client'

import { motion } from 'motion/react'
import { isMobileApp } from '@penx/constants'
import { useCreations } from '@penx/hooks/useCreations'
import { useJournal } from '@penx/hooks/useJournal'
import { Panel } from '@penx/types'
import { mappedByKey } from '@penx/utils'
import { CreationCard } from './CreationCard'
import { JournalTitle } from './JournalTitle'

interface Props {
  panel: Panel
}

export function JournalContent({ panel }: Props) {
  const { creations } = useCreations()
  const { isLoading, data } = useJournal(panel.date)
  if (isLoading) return null
  const creationMaps = mappedByKey(creations, 'id')

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-8">
      {!isMobileApp && <JournalTitle date={data?.props.date!} />}

      {!data?.props.children.length && (
        <div className="flex flex-col gap-4 pt-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.2 }}
            className="text-foreground/80 text-2xl font-semibold"
          >
            Hello there!
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.3 }}
            className="text-foreground/60 text-2xl"
          >
            What's on your mind today?
          </motion.div>
        </div>
      )}

      {!!data?.props.children.length && (
        <div className="flex flex-col gap-4">
          {data?.props.children.map((id) => {
            const creation = creationMaps[id]

            if (!creation) return null
            return <CreationCard key={id} creation={creation}></CreationCard>
          })}
        </div>
      )}
    </div>
  )
}
