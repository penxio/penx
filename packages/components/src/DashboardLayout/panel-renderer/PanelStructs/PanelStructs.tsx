'use client'

import { Trans } from '@lingui/react/macro'
import { isMobileApp } from '@penx/constants'
import { appEmitter } from '@penx/emitter'
import { store } from '@penx/store'
import { Panel } from '@penx/types'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'
import { useStructDialog } from '../../../StructDialog/useStructDialog'
import { ClosePanelButton } from '../../ClosePanelButton'
import { PanelHeaderWrapper } from '../../PanelHeaderWrapper'
import { PublishedStructList } from './PublishedStructList'
import { StructList } from './StructList'

interface Props {
  panel: Panel
  index: number
}

export function PanelStructs({ panel, index }: Props) {
  const { setState } = useStructDialog()
  return (
    <>
      <PanelHeaderWrapper index={index}>
        <div>
          <Trans>Structs</Trans>
        </div>
        <ClosePanelButton panel={panel} />
      </PanelHeaderWrapper>

      <div className="flex h-full flex-col overflow-hidden">
        <div
          className={cn(
            'mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 pt-10 ',
            'px-3',
          )}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-foreground/50 text-base">
                <Trans>My Structs</Trans>
              </div>
              <Button
                size="xs"
                className="rounded-lg"
                onClick={() => setState({ isOpen: true, struct: null as any })}
              >
                <Trans>Create</Trans>
              </Button>
            </div>
            <StructList
              onSelect={(struct) => {
                if (isMobileApp) {
                  appEmitter.emit('ROUTE_TO_STRUCT_INFO', struct)
                  return
                }
                store.panels.openStruct(struct.id)
                appEmitter.emit('ROUTE_TO_STRUCT')
              }}
            />
          </div>

          <div className="space-y-3">
            <div className="text-foreground/50 text-base">
              <Trans>Struct marketplace</Trans>
            </div>
            <PublishedStructList />
          </div>
        </div>
      </div>
    </>
  )
}
