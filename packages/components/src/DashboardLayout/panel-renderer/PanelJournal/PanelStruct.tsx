'use client'

import { useStructs } from '@penx/hooks/useStructs'
import { Panel } from '@penx/types'
import { FullPageDatabase } from '../../../database-ui'
import { WithSize } from '../../../WithSize'
import { PanelWidgetHeader } from '../PanelWidgetHeader'
import { PanelNotes } from './PanelNotes'

interface Props {
  panel: Panel
  index: number
}

export function PanelStruct({ panel, index }: Props) {
  const { structs } = useStructs()
  const struct = structs.find((m) => m.id === panel.structId)!
  if (!struct) return null

  if (struct.isNote) {
    return (
      <>
        <PanelWidgetHeader index={index} panel={panel} />
        <WithSize className="flex-1 overflow-hidden bg-amber-100">
          {(size) => <PanelNotes {...size} />}
        </WithSize>
      </>
    )
  }

  return <FullPageDatabase struct={struct} />
}
