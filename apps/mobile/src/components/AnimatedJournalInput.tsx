import React, { useRef, useState } from 'react'
import { useKeyboard } from '@/hooks/useKeyboard'
import { Capacitor } from '@capacitor/core'
import { AnimatePresence, motion } from 'motion/react'
import { JournalQuickInput } from '@penx/components/JournalQuickInput'
import { cn } from '@penx/utils'

const platform = Capacitor.getPlatform()

interface Props {
  open: boolean
  setOpen: (isOpen: boolean) => void
  ref?: any
}

export const AnimatedJournalInput = ({ open, setOpen, ref }: Props) => {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { height } = useKeyboard()

  return (
    <>
      {open && (
        <div
          // initial="closed"
          // variants={{
          //   open: {
          //     opacity: 1,
          //     display: 'block',
          //     transition: {
          //       duration: 0.2,
          //     },
          //   },
          //   closed: {
          //     opacity: 0,
          //     display: 'none',
          //     transition: {
          //       duration: 0.2,
          //     },
          //   },
          // }}
          // animate={open ? 'open' : 'closed'}
          className={cn(
            'bg-background/50 fixed bottom-0 left-0 right-0 top-0 z-[10000] blur-sm',
          )}
          onClick={() => {
            setOpen(false)
          }}
        ></div>
      )}

      <AnimatePresence>
        {open && (
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
        )}
      </AnimatePresence>
    </>
  )
}
