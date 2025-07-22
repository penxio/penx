'use client'

import React, { useMemo, useState } from 'react'
import { t } from '@lingui/core/macro'
import { Trans, useLingui } from '@lingui/react/macro'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { api } from '@penx/api'
import { Button } from '@penx/uikit/button'
import { syncNodesToServer } from '@penx/worker/lib/syncNodesToServer'
import { SyncIntervalSelect } from './SyncIntervalSelect'
import { WifiSwitch } from './WifiSwitch'

const MotionButton = motion.create(Button)
interface Props {}

export function SyncContent({}: Props) {
  const { i18n } = useLingui()

  return (
    <div className="text-foreground mx-auto flex h-full max-w-96 flex-1 flex-col gap-6 px-10">
      <div className="flex flex-col gap-2">
        <div className="space-y-3">
          <div className="flex justify-center text-center text-2xl font-bold">
            <Trans>PenX Sync</Trans>
          </div>
          <div className="text-foreground/60 text-center">
            <Trans>
              PenX is a Local-first App, supporting offline use and multi-device
              sync.
            </Trans>
          </div>
        </div>
      </div>
      <MotionButton
        whileTap={{ scale: 1.1 }}
        size="xl"
        onClick={async () => {
          toast.promise(
            async () => {
              await syncNodesToServer()
            },
            {
              loading: t`Syncing...`,
              success: t`Sync successful!`,
              error: () => {
                return t`Sync failed, please try again.`
              },
            },
          )
        }}
      >
        <Trans>Sync now</Trans>
      </MotionButton>

      <SyncIntervalSelect></SyncIntervalSelect>
      <WifiSwitch />
    </div>
  )
}
