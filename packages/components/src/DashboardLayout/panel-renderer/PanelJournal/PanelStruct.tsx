'use client'

import { Trans } from '@lingui/react/macro'
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
        <PanelWidgetHeader
          className="z-20"
          index={index}
          panel={panel}
          title={<Trans>Notes</Trans>}
        />
        <WithSize className="z-20 flex-1 overflow-hidden">
          {(size) => {
            if (
              typeof size.height === 'number' &&
              typeof size.width === 'number'
            ) {
              return <PanelNotes {...(size as any)} />
            }
            return null
          }}
        </WithSize>

        <div
          className="absolute bottom-0 left-0 right-0 top-0 z-10 opacity-30 dark:opacity-0"
          style={{
            filter: 'blur(150px) saturate(150%)',
            transform: 'translateZ(0)',
            backgroundImage:
              'radial-gradient(at 27% 37%, #eea5ba 0, transparent 50%), radial-gradient(at 97% 21%, #fd3a4e 0, transparent 50%), radial-gradient(at 52% 99%, #e4c795 0, transparent 50%), radial-gradient(at 10% 29%, #5afc7d 0, transparent 50%), radial-gradient(at 97% 96%, #8ca8e8 0, transparent 50%), radial-gradient(at 33% 50%, #9772fe 0, transparent 50%), radial-gradient(at 79% 53%, #3a8bfd 0, transparent 50%)',
          }}
        ></div>
      </>
    )
  }

  return <FullPageDatabase struct={struct} />
}
