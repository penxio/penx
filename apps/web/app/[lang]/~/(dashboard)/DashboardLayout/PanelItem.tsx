'use client'

import { ResizableHandle, ResizablePanel } from '@penx/uikit/ui/resizable'
import { Panel, PanelType } from '@/lib/types'
import { ClosePanelButton } from './ClosePanelButton'
import { PanelCreation } from './panel-renderer/PanelCreation'
import { PanelHome } from './panel-renderer/PanelHome'
import { PanelWidget } from './panel-renderer/PanelWidget'

export function PanelItem({
  panel,
  isLast,
  index,
}: {
  panel: Panel
  isLast: boolean
  index: number
}) {
  const sizes: any = {}
  if (panel.size) sizes.defaultSize = panel.size

  return (
    <>
      <ResizablePanel
        {...sizes}
        className="bg-background flex flex-col rounded-md shadow-sm dark:bg-[#181818]"
        minSize={20}
        style={{
          height: 'calc(100vh - 16px)',
        }}
      >
        {panel.type === PanelType.CREATION && (
          <PanelCreation index={index} panel={panel} />
        )}

        {panel.type === PanelType.HOME && (
          <PanelHome index={index} panel={panel} />
        )}

        {panel.type === PanelType.WIDGET && (
          <PanelWidget index={index} panel={panel} />
        )}
      </ResizablePanel>
      {!isLast && <ResizableHandle className="bg-transparent px-0.5" />}
    </>
  )
}
