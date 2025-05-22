'use client'

import { motion } from 'motion/react'
import { isMobileApp } from '@penx/constants'
import { useActiveStruct } from '@penx/hooks/useActiveStruct'
import { useCreations } from '@penx/hooks/useCreations'
import { useJournal } from '@penx/hooks/useJournal'
import { cn, mappedByKey } from '@penx/utils'
import { CreationCard } from './CreationCard'
import { JournalTitle } from './JournalTitle'
import { StructTypeSelect } from './StructTypeSelect'

interface Props {
  date: string
}

export function JournalContent({ date }: Props) {
  const { creations } = useCreations()

  const { struct } = useActiveStruct()
  const { isLoading, data } = useJournal(date)
  if (isLoading) return null
  const creationMaps = mappedByKey(creations, 'id')

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-8">
      {!isMobileApp && <JournalTitle date={data?.props.date!} />}
      {/* <StructTypeSelect /> */}

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
        <div className={cn('flex flex-col gap-4', isMobileApp && 'gap-6')}>
          {data?.props.children.map((id) => {
            const creation = creationMaps[id]
            if (!creation) return null
            if (struct && creation.structId !== struct.id) return null
            return <CreationCard key={id} creation={creation}></CreationCard>
          })}
        </div>
      )}
    </div>
  )
}
