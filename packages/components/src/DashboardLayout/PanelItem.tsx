'use client'

import { ErrorBoundary } from 'react-error-boundary'
import { set } from 'idb-keyval'
import { isMobileApp } from '@penx/constants'
import { useArea } from '@penx/hooks/useArea'
import { Panel, PanelType } from '@penx/types'
import { ResizableHandle, ResizablePanel } from '@penx/uikit/resizable'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'
import { ClosePanelButton } from './ClosePanelButton'
import { LocalBackup } from './panel-renderer/LocalBackup/LocalBackup'
import { ManageTags } from './panel-renderer/ManageTags/ManageTags'
import { PanelAISetting } from './panel-renderer/PanelAISetting'
import { PanelCreation } from './panel-renderer/PanelCreation'
import { PanelJournal } from './panel-renderer/PanelJournal/PanelJournal'
import { PanelStruct } from './panel-renderer/PanelJournal/PanelStruct'
import { PanelStructs } from './panel-renderer/PanelStructs/PanelStructs'
import { PanelTag } from './panel-renderer/PanelTag'
import { PanelTasks } from './panel-renderer/PanelTasks/PanelTasks'
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
  const { area } = useArea()
  const sizes: any = {}
  if (panel.size) sizes.defaultSize = panel.size

  const renderJsx = (
    <>
      {panel.type === PanelType.TASKS && (
        <PanelTasks index={index} panel={panel} />
      )}

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
        <>
          <ClosePanelButton panel={panel} className="absolute right-1 top-2" />
          <PanelStruct index={index} panel={panel} />
        </>
      )}

      {panel.type === PanelType.TAG && <PanelTag index={index} panel={panel} />}

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
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }: any) => {
        return (
          <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-1">
            <div className="text-foreground/60 text-lg">
              ⚠️Something went wrong
              {JSON.stringify(error, null, 2)}
            </div>
            <Button
              onClick={async () => {
                const key = `PANELS_${area.id}`
                set(key, [])
                window.location.reload()
              }}
            >
              Reload App
            </Button>
          </div>
        )
      }}
    >
      <ResizablePanel
        {...sizes}
        className={cn(
          'bg-background relative flex flex-col overflow-hidden rounded-md shadow-sm dark:bg-[#181818]',
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
    </ErrorBoundary>
  )
}
