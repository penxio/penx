'use client'

import { Panel, PanelType } from '@penx/types'
import { ResizableHandle, ResizablePanel } from '@penx/uikit/resizable'
import { cn } from '@penx/utils'
import { ClosePanelButton } from './ClosePanelButton'
import { LocalBackup } from './panel-renderer/LocalBackup/LocalBackup'
import { ManageTags } from './panel-renderer/ManageTags/ManageTags'
import { PanelAIProviders } from './panel-renderer/PanelAIProviders'
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
        className={cn(
          'bg-background flex flex-col rounded-md shadow-sm dark:bg-[#181818]',
          // panel.type === PanelType.HOME && 'bg-transparent',
        )}
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

        {panel.type === PanelType.AI_PROVIDERS && (
          <PanelAIProviders index={index} panel={panel} />
        )}

        {panel.type === PanelType.MANAGE_TAGS && (
          <ManageTags index={index} panel={panel} />
        )}

        {panel.type === PanelType.LOCAL_BACKUP && (
          <LocalBackup index={index} panel={panel} />
        )}

        {panel.type === PanelType.WIDGET && (
          <PanelWidget index={index} panel={panel} />
        )}
      </ResizablePanel>
      {!isLast && <ResizableHandle className="bg-transparent px-0.5" />}
    </>
  )
}
