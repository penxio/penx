'use client'

import { Panel } from '@penx/types'
import { ProviderSetting } from '../../AISetting/provider-setting'
import { ClosePanelButton } from '../ClosePanelButton'
import { PanelHeaderWrapper } from '../PanelHeaderWrapper'

interface Props {
  panel: Panel
  index: number
}

export function PanelAISetting({ panel, index }: Props) {
  return (
    <>
      <PanelHeaderWrapper index={index}>
        <div>AI setting</div>
        <ClosePanelButton panel={panel} />
      </PanelHeaderWrapper>

      <div className="h-full flex-col space-y-4 overflow-auto px-4 pb-20 pt-10">
        <ProviderSetting />
      </div>
    </>
  )
}
