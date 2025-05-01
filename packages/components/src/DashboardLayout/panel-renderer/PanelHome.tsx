'use client'

import { Trans } from '@lingui/react'
import { ClockIcon } from 'lucide-react'
import { AreaInfo } from '@penx/components/AreaInfo'
import { useCreations } from '@penx/hooks/useCreations'
import { store } from '@penx/store'
import { Panel, PanelType } from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { ClosePanelButton } from '../ClosePanelButton'
import { PanelHeaderWrapper } from '../PanelHeaderWrapper'

interface Props {
  panel: Panel
  index: number
}

export function PanelHome({ panel, index }: Props) {
  const { creations: data } = useCreations()

  const creations = [...data]
    .sort((a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf())
    .slice(0, 10)

  return (
    <>
      <PanelHeaderWrapper index={index}>
        <div></div>
        <ClosePanelButton panel={panel} />
      </PanelHeaderWrapper>

      <div className="h-full overflow-hidden px-4 pt-20">
        <div className="mx-auto max-w-2xl space-y-10">
          <AreaInfo />
          <div>
            <div className="flex items-center gap-1">
              <ClockIcon size={12} />
              <span className="text-foreground/50 text-sm font-medium">
                <Trans id="Recently visited"></Trans>
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-2 text-base">
              {creations.slice(0, 20).map((item) => (
                <div key={item.id}>
                  <div
                    className="hover:text-brand text-foreground/80 cursor-pointer"
                    onClick={() => {
                      store.panels.updateMainPanel({
                        id: uniqueId(),
                        type: PanelType.CREATION,
                        creationId: item.id,
                      })
                    }}
                  >
                    {item.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
