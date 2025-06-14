'use client'

import { useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { ArrowLeftIcon, PlusIcon } from 'lucide-react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { Creation } from '@penx/domain'
import { StructType } from '@penx/types'
import { ImageCreation } from './CreationItem/ImageCreation'
import { TakePhotoButton } from './TakePhotoButton'

interface Props {
  creations: Creation[]
}

export function JournalPhotoWidget({ creations }: Props) {
  const [open, setOpen] = useState(false)
  const images = creations.filter((c) => c.type === StructType.IMAGE)

  return (
    <LayoutGroup>
      <motion.div
        layoutId="photo-card"
        className="bg-background shadow-card inline-flex h-auto min-w-[50vw] flex-col rounded-2xl p-3 font-bold"
      >
        <motion.div
          className="mb-2 flex items-center justify-between gap-2"
          onClick={() => {
            // setOpen(true)
          }}
        >
          <motion.div
            layoutId="photo-card-title"
            className="text-base font-bold"
          >
            <Trans>Photos</Trans>
          </motion.div>
          <TakePhotoButton />
        </motion.div>

        {!images.length && (
          <TakePhotoButton>
            <div className="text-foreground/40 border-foreground/10 flex size-9 items-center justify-center rounded-lg border border-dashed">
              <PlusIcon size={24} />
            </div>
          </TakePhotoButton>
        )}
        {!!images.length && (
          <div className="grid flex-1 grid-cols-4  items-start justify-center gap-x-2 gap-y-2">
            {images.slice(0, 8).map((creation) => (
              <ImageCreation key={creation.id} creation={creation} />
            ))}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="photo-card"
            className="fixed bottom-0 left-0 right-0 top-0 z-[1000] flex justify-center bg-white"
            style={{
              paddingTop: 'calc(var(--safe-area-inset-top) + 6px)',
            }}
            onClick={() => setOpen(false)}
          >
            <motion.div className="inline-flex h-auto w-full min-w-[50vw] flex-col rounded-2xl p-3 font-bold">
              <motion.div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <ArrowLeftIcon
                    className="text-foreground/60"
                    size={20}
                    onClick={() => {
                      setOpen(false)
                    }}
                  />
                  <motion.div
                    layoutId="photo-card-title"
                    className="text-base font-bold"
                  >
                    <Trans>Photos</Trans>
                  </motion.div>
                </div>
                <TakePhotoButton />
              </motion.div>
              <div>
                <Trans>Capture the beautiful moments</Trans>
              </div>
              <div className="mb-2 flex-1 columns-2 gap-x-2">
                {images.slice(0, 8).map((creation) => (
                  <div key={creation.id} className="">
                    TODO
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  )
}
