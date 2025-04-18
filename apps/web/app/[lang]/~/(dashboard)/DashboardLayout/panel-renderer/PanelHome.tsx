'use client'

import { useAreaContext } from '@/components/AreaContext'
import { useAreaCreationsContext } from '@/components/AreaCreationsContext'
import { AreaInfo } from '@/components/AreaInfo'
import { useAreaCreations } from '@/hooks/useAreaCreations'
import { updateMainPanel } from '@/hooks/usePanels'
import { Panel, PanelType } from '@/lib/types'
import { uniqueId } from '@/lib/unique-id'
import { Trans } from '@lingui/react/macro'
import { ClockIcon } from 'lucide-react'

interface Props {
  panel: Panel
  index: number
}

export function PanelHome(props: Props) {
  const field = useAreaContext()
  const data = useAreaCreationsContext()

  const creations = data
    .sort((a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf())
    .slice(0, 10)

  return (
    <div className="h-full overflow-hidden px-4 pt-20">
      <div className="mx-auto max-w-2xl space-y-10">
        <AreaInfo />
        <div>
          <div className="flex items-center gap-1">
            <ClockIcon size={12} />
            <span className="text-foreground/50 text-sm font-medium">
              <Trans>Recently visited</Trans>
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {creations.slice(0, 20).map((item) => (
              <div key={item.id}>
                <div
                  className="hover:text-brand text-foreground/80 cursor-pointer"
                  onClick={() => {
                    updateMainPanel({
                      id: uniqueId(),
                      type: PanelType.CREATION,
                      creation: item,
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
  )
}
