'use client'

import { isMobileApp } from '@penx/constants'
import { Panel, PanelType } from '@penx/types'
import { ResizableHandle, ResizablePanel } from '@penx/uikit/resizable'
import { cn } from '@penx/utils'
import { LocalBackup } from './panel-renderer/LocalBackup/LocalBackup'
import { ManageTags } from './panel-renderer/ManageTags/ManageTags'
import { PanelAISetting } from './panel-renderer/PanelAISetting'
import { PanelCreation } from './panel-renderer/PanelCreation'
import { PanelJournal } from './panel-renderer/PanelJournal/PanelJournal'
import { PanelStruct } from './panel-renderer/PanelJournal/PanelStruct'
import { PanelStructs } from './panel-renderer/PanelStructs/PanelStructs'
import { PanelWidget } from './panel-renderer/PanelWidget'
import { PanelWidgetHeader } from './panel-renderer/PanelWidgetHeader'

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

  const renderJsx = (
    <>
      {panel.type === PanelType.CREATION && (
        <PanelCreation index={index} panel={panel} />
      )}

      {panel.type === PanelType.JOURNAL && (
        <PanelJournal index={index} panel={panel} />
      )}

      {panel.type === PanelType.ALL_STRUCTS && (
        <PanelStructs panel={panel} index={index} />
      )}

      {panel.type === PanelType.STRUCT && (
        <PanelStruct index={index} panel={panel} />
      )}

      {panel.type === PanelType.AI_SETTING && (
        <PanelAISetting index={index} panel={panel} />
      )}

      {panel.type === PanelType.MANAGE_TAGS && (
        <ManageTags index={index} panel={panel} />
      )}

      {panel.type === PanelType.LOCAL_BACKUP && (
        <LocalBackup index={index} panel={panel} />
      )}

      {panel.type === PanelType.WIDGET && (
        <>
          {!isMobileApp && <PanelWidgetHeader index={index} panel={panel} />}
          <PanelWidget index={index} panel={panel} />
        </>
      )}
    </>
  )

  if (isMobileApp) return renderJsx

  return (
    <>
      <ResizablePanel
        {...sizes}
        className={cn(
          'bg-background flex flex-col overflow-hidden rounded-md shadow-sm dark:bg-[#181818]',
          // panel.type === PanelType.HOME && 'bg-transparent',
          // panel.type === PanelType.TODAY && 'bg-yellow-50',
          isMobileApp && 'bg-transparent shadow-none dark:bg-transparent',
        )}
        minSize={20}
        style={{
          height: 'calc(100vh - 16px)',
          width: panel.type === PanelType.WIDGET ? 100 : 'auto',
        }}
      >
        {renderJsx}
      </ResizablePanel>
      {!isLast && <ResizableHandle className="bg-transparent px-0.5" />}
    </>
  )
}
