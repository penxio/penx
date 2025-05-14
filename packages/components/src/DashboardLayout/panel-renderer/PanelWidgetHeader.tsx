'use client'

import { useMolds } from '@penx/hooks/useMolds'
import { Panel, Widget } from '@penx/types'
import { WidgetName } from '@penx/widgets/WidgetName'
import { ClosePanelButton } from '../ClosePanelButton'
import { PanelHeaderWrapper } from '../PanelHeaderWrapper'

interface Props {
  panel: Panel
  index: number
}

export function PanelWidgetHeader({ panel, index }: Props) {
  const { molds } = useMolds()
  const widget = panel.widget as Widget

  return (
    <PanelHeaderWrapper index={index}>
      <div>
        <WidgetName widget={widget} molds={molds} />
      </div>
      <ClosePanelButton panel={panel} />
    </PanelHeaderWrapper>
  )
}
