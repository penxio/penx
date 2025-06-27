'use client'

import { useStructs } from '@penx/hooks/useStructs'
import { Panel, Widget } from '@penx/types'
import { WidgetName } from '@penx/widgets/WidgetName'
import { ClosePanelButton } from '../ClosePanelButton'
import { PanelHeaderWrapper } from '../PanelHeaderWrapper'

interface Props {
  panel: Panel
  index: number
}

export function PanelWidgetHeader({ panel, index }: Props) {
  const { structs } = useStructs()
  const widget = panel.widget as Widget

  return (
    <PanelHeaderWrapper index={index}>
      <div>{widget && <WidgetName widget={widget} structs={structs} />}</div>
      <ClosePanelButton panel={panel} />
    </PanelHeaderWrapper>
  )
}
