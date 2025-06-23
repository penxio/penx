import React, { useRef, useState } from 'react'
import { useKeyboard } from '@/hooks/useKeyboard'
import { Capacitor } from '@capacitor/core'
import { AnimatePresence, motion } from 'motion/react'
import { JournalQuickInput } from '@penx/components/JournalQuickInput'
import { useQuickInputOpen } from '@penx/hooks/useQuickInputOpen'
import { Portal } from '@penx/uikit/components/Portal'
import { cn } from '@penx/utils'

const platform = Capacitor.getPlatform()

interface Props {
  ref?: any
}

export const AnimatedJournalInput = ({ ref }: Props) => {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { height } = useKeyboard()

  const { open, setOpen } = useQuickInputOpen()

  return (
    <>
      <AnimatePresence>
        {open && (
          <Portal>
            <motion.div
              className={cn(
                'bg-background/50 fixed bottom-0 left-0 right-0 top-0 z-[10000] blur-sm',
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpen(false)}
            ></motion.div>

            <motion.div
              initial="closed"
              exit="closed"
              variants={{
                open: {
                  height: 'auto',
                  // translateY: 80,
                  // opacity: 1,
                  bottom: platform === 'ios' ? height + 20 : 20,
                  transition: {
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                    // mass: 0.5,
                    // duration: 0.1,
                  },
                },
                closed: {
                  // translateY: '-140%',
                  // opacity: 0,
                  bottom: platform === 'ios' ? -height : -300,
                  // bottom: 0,
                  transition: {
                    // type: 'tween',
                    // duration: 0.2,
                  },
                },
              }}
              animate={open ? 'open' : 'closed'}
              className={cn(
                'fixed z-[10000000] mx-auto flex w-[100vw] flex-col bg-transparent',
                open && 'mb-2',
              )}
            >
              <div className="mx-auto w-[92vw] flex-1">
                <JournalQuickInput
                  ref={inputRef}
                  onCancel={() => setOpen(false)}
                  afterSubmit={() => {
                    setOpen(false)
                  }}
                />
              </div>
            </motion.div>
          </Portal>
        )}
      </AnimatePresence>
    </>
  )
}
