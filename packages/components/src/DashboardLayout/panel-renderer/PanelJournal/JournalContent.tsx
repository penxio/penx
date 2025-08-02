'use client'

import { Trans } from '@lingui/react/macro'
import { motion } from 'motion/react'
import { isMobileApp } from '@penx/constants'
import { useActiveStruct } from '@penx/hooks/useActiveStruct'
import { useCreations } from '@penx/hooks/useCreations'
import { useJournal } from '@penx/hooks/useJournal'
import { useJournalLayout } from '@penx/hooks/useJournalLayout'
import { cn, mappedByKey } from '@penx/utils'
import { CreationCard } from '../../../CreationCard/CreationCard'
import { JournalTitle } from './JournalTitle'
import { JournalWidget } from './JournalWidget'

interface Props {
  date?: string
  showJournalTitle?: boolean
  journalTitle?: React.ReactNode
}

export function JournalContent(props: Props) {
  const { creations } = useCreations()
  const { struct } = useActiveStruct()
  const { isCard, isList, isWidget } = useJournalLayout()
  const { journal } = useJournal()
  // console.log('=========journal:', journal)
  if (!journal) return null

  const date = journal.date

  // console.log('====journal:', journal)
  const journalCreations = creations.filter((c) => c.date === date)

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-8">
      {props.showJournalTitle &&
        (props.journalTitle ? (
          props.journalTitle
        ) : (
          <JournalTitle date={date} />
        ))}

      {/* {!journalCreations.length && (
        <div className="flex h-[50vh] flex-col items-center justify-center gap-4 pt-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.1 }}
            className="text-foreground/60 text-2xl"
          >
            <Trans>What's on your mind today?</Trans>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.2 }}
            className="text-foreground/40 text-xs"
          >
            <Trans>AI Powered Personal Data Hub</Trans>
          </motion.div>
        </div>
      )} */}

      <JournalWidget creations={journalCreations} />

      {!!journalCreations.length && !isWidget && (
        <div
          className={cn(
            isCard ? 'columns-2 gap-x-2 align-top' : 'flex flex-col gap-4 ',
            // isMobileApp && !isCard && 'gap-6',
            isMobileApp && isList && 'gap-0',
          )}
        >
          {journalCreations.map((creation) => {
            return <CreationCard key={creation.id} creation={creation} />
          })}
        </div>
      )}
    </div>
  )
}
