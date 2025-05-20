'use client'

import { useArea } from '@penx/hooks/useArea'
import { store } from '@penx/store'
import { Panel, PanelType, StructType } from '@penx/types'
import { Button } from '@penx/uikit/ui/button'
import { uniqueId } from '@penx/unique-id'
import { useStructDialog } from '../../../StructDialog/useStructDialog'
import { PublishedStructList } from './PublishedStructList'
import { StructList } from './StructList'

interface Props {
  panel: Panel
  index: number
}

export function PanelStructs({ panel, index }: Props) {
  const { setState } = useStructDialog()
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 pt-10 ">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-foreground/50 text-base">My Structs</div>
            <Button
              size="xs"
              className="rounded-lg"
              onClick={() => setState({ isOpen: true, struct: null as any })}
            >
              Create
            </Button>
          </div>
          <StructList
            onSelect={(struct) => {
              store.panels.openWidgetPanel(
                {
                  id: uniqueId(),
                  type: PanelType.WIDGET,
                  structId: struct.id,
                },
                true,
              )
            }}
          />
        </div>

        <div className="space-y-3">
          <div className="text-foreground/50 text-base">Struct marketplace</div>
          <PublishedStructList />
        </div>
      </div>
    </div>
  )
}
