'use client'

import GridLayout from 'react-grid-layout'
import { Button } from '@/components/ui/button'
import { Link } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { Trans } from '@lingui/react/macro'
import { CardRender } from './CardRender'
import { DeleteCardButton } from './DeleteCardButton'
import { DeviceToggle } from './DeviceToggle'
import { EditCardButton } from './EditCardButton'
import { GardenDesignBar } from './GardenDesignBar'
import { GardenSettingsDialog } from './GardenSettingsDialog/GardenSettingsDialog'
import { useDesignContext } from './hooks/DesignContext'
import { useUpdateLayout } from './hooks/useUpdateLayout'
import { NavigationList } from './NavigationList'

export function GardenDesign() {
  const { isMobile, formattedLayout, layout, config } = useDesignContext()
  const updateLayout = useUpdateLayout()

  return (
    <div className="relative flex h-full flex-col gap-8 pb-20 pt-10">
      <DeviceToggle />
      <GardenSettingsDialog />

      <GardenDesignBar />

      <div className="mx-auto flex flex-1 flex-col gap-4 pl-44">
        <div className="-mx-40 flex h-10 items-center justify-center gap-2">
          <NavigationList />
          <Link href="/~/settings/navigation?from=/~/design">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 rounded-md text-sm"
            >
              <Trans>Edit</Trans>
            </Button>
          </Link>
        </div>
        <div
          className="mx-auto"
          style={{
            width: isMobile ? 450 : config.containerWidth,
            // background: config.bgColor,
          }}
        >
          <GridLayout
            className="layout z-10 shrink-0 rounded-2xl pb-40"
            layout={formattedLayout}
            cols={isMobile ? 4 : 8}
            rowHeight={config.rowHeight}
            style={{
              width: isMobile ? 450 : config.containerWidth,
              // background: config.bgColor,
            }}
            width={isMobile ? 450 : config.containerWidth}
            margin={isMobile ? [20, 20] : [config.margin, config.margin]}
            resizeHandle={null}
            isResizable={false}
            // isDraggable={false}
            onDragStop={async (newLayout, oldItem, newItem) => {
              await updateLayout(newLayout)
            }}
            onLayoutChange={async (layout) => {
              // console.log('====layout:', layout, JSON.stringify(layout))
            }}
          >
            {layout.map((item) => {
              return (
                <div
                  key={item.i}
                  className={cn(
                    'ring-foreground/3 bg-background group relative rounded-xl shadow ring-1',
                  )}
                >
                  <DeleteCardButton item={item} />
                  <EditCardButton item={item} />
                  <CardRender item={item} />
                </div>
              )
            })}
          </GridLayout>
        </div>
      </div>
    </div>
  )
}
