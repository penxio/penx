'use client'

import { useEffect, useState } from 'react'
import {
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
} from '@floating-ui/react'
import { Trans } from '@lingui/react/macro'
import { format } from 'date-fns'
import { ArrowLeftIcon, XIcon } from 'lucide-react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { isMobileApp } from '@penx/constants'
import { Creation } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
import { useCreations } from '@penx/hooks/useCreations'
import { useJournal } from '@penx/hooks/useJournal'
import { useJournals } from '@penx/hooks/useJournals'
import { store } from '@penx/store'
import { StructType } from '@penx/types'
import { Calendar } from '@penx/uikit/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { Portal } from '@penx/uikit/Portal'
import { Button } from '@penx/uikit/ui/button'
import { MobileCalendar } from '@penx/uikit/ui/mobile-calendar'
import { cn } from '@penx/utils'
import { MobileJournalShortcut } from './MobileJournalShortcut'

interface Props {
  creations: Creation[]
}

export function JournalTitleWidget({ creations }: Props) {
  const [open, setOpen] = useState(false)
  const tasks = creations.filter((c) => c.type === StructType.TASK)
  const doneCount = tasks.filter((t) => t.checked).length
  const { journal } = useJournal()
  const { creations: allCreations } = useCreations()

  const { refs, context, floatingStyles } = useFloating({
    placement: 'bottom-start',
    open: open,
    middleware: [offset(0), flip(), shift()],
    onOpenChange: (open) => {
      setOpen(open)
    },
  })

  console.log(
    '=======floatingStyles:',
    floatingStyles,
    context.strategy,
    context.x,
    context.y,
  )

  const weekdayAbbr = [
    <Trans>Sun</Trans>,
    <Trans>Mon</Trans>,
    <Trans>Tue</Trans>,
    <Trans>Wed</Trans>,
    <Trans>Thu</Trans>,
    <Trans>Fri</Trans>,
    <Trans>Sat</Trans>,
  ]
  const dayNum = new Date(journal.date).getDay()

  const initialDate = new Date(journal.date)

  const [date, setDate] = useState<Date>(initialDate || new Date())

  useEffect(() => {
    if (format(date, 'yyyy-MM-dd') !== format(initialDate, 'yyyy-MM-dd')) {
      setDate(new Date(journal.date))
    }
  }, [initialDate])

  const daysWithNotes = allCreations
    .reduce<string[]>((acc, item) => {
      const date = item.date
      if (acc.includes(date)) return acc
      return [...acc, date]
    }, [])
    .map((date) => new Date(date))

  const dayJSX = (
    <motion.div
      layoutId="title-card-date"
      className="mb-2 flex  items-center gap-2"
      onClick={() => {
        // setOpen(true)
      }}
    >
      <div className="text-2xl font-bold">
        {format(new Date(journal.date), 'MM/dd')}
      </div>
      <div className="mt-1 text-sm font-light">{weekdayAbbr[dayNum]}</div>
    </motion.div>
  )

  const floatingJSX = (
    <motion.div
      className={cn(
        'inline-flex h-auto flex-col p-3 font-bold',
        isMobileApp && 'w-full min-w-[50vw]',
      )}
    >
      <div className="flex justify-center">{dayJSX}</div>
      <motion.div className="mb-2 flex items-center justify-center gap-2">
        <MobileCalendar
          mode="single"
          className="w-full"
          selected={date}
          modifiers={{
            hasNotes: daysWithNotes,
          }}
          modifiersClassNames={{
            hasNotes: 'day-with-notes',
          }}
          onSelect={(date) => {
            console.log('========date:', date)
            setOpen(false)
            if (date) {
              setDate(date!)
              store.journals.goToDay(date)
            }
          }}
          initialFocus
          footer={
            <div className="gap1 mt-2 flex flex-col items-center justify-center gap-3">
              <MobileJournalShortcut
                date={initialDate}
                onSelect={(date) => {
                  setDate(date)
                  setOpen(false)
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                className="shadow-popover rounded-full"
                onClick={() => setOpen(false)}
              >
                <XIcon />
              </Button>
            </div>
          }
        />
      </motion.div>
    </motion.div>
  )

  return (
    <LayoutGroup>
      <motion.div
        ref={refs.setReference}
        layoutId="title-card"
        className="bg-background shadow-card relative flex h-auto flex-1 flex-col justify-between rounded-2xl p-3"
        onClick={() => {
          setOpen(true)
        }}
      >
        {dayJSX}
        <div className="text-foreground mt-auto flex flex-col gap-1 text-xs">
          <span>
            <Trans>{`${doneCount}/${tasks.length}`} tasks</Trans>
          </span>
          <span>
            <Trans>{`${creations.length}`} creations</Trans>
          </span>
        </div>
      </motion.div>

      {isMobileApp && (
        <AnimatePresence>
          {open && (
            <motion.div
              ref={refs.setFloating}
              layoutId="title-card"
              className="bg-background fixed bottom-0 left-0 right-0 top-0 z-[1000] flex justify-center"
              style={{
                paddingTop: 'calc(var(--safe-area-inset-top) + 6px)',
              }}
            >
              {floatingJSX}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {!isMobileApp && (
        <AnimatePresence>
          {open && (
            <Portal>
              <motion.div
                className="fixed bottom-0 left-0 right-0 top-0 z-40 bg-black/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setOpen(false)}
              ></motion.div>
              <motion.div
                ref={refs.setFloating}
                layoutId="title-card"
                className="bg-background z-50 flex flex-col items-center justify-center rounded-2xl"
                style={{
                  // ...floatingStyles,
                  position: context.strategy,
                  top: context.y - 136,
                  left: context.x === 0 ? 16 : context.x,
                }}
              >
                {floatingJSX}
              </motion.div>
            </Portal>
          )}
        </AnimatePresence>
      )}
    </LayoutGroup>
  )
}
