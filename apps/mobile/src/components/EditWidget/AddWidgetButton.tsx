'use client'

import { useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { isMobileApp, WidgetType } from '@penx/constants'
import { Struct } from '@penx/domain'
import { useStructs } from '@penx/hooks/useStructs'
import { getCreationIcon } from '@penx/libs/getCreationIcon'
import { store } from '@penx/store'
import { Button } from '@penx/uikit/button'
import LoadingCircle from '@penx/uikit/loading-circle'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { Separator } from '@penx/uikit/separator'
import { uniqueId } from '@penx/unique-id'
import { cn } from '@penx/utils'
import { StructName } from '@penx/widgets/StructName'
import { WidgetIcon } from '@penx/widgets/WidgetIcon'
import { Card } from '../ui/Card'
import { CardItem } from '../ui/CardItem'
import { Drawer } from '../ui/Drawer'
import { DrawerHeader } from '../ui/DrawerHeader'
import { DrawerTitle } from '../ui/DrawerTitle'

interface Props {
  className?: string
  children?: React.ReactNode
}

export function AddWidgetButton({ className }: Props) {
  const [isLoading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const { structs } = useStructs()

  async function addStructWidget(struct: Struct) {
    setOpen(false)
    await store.area.addWidget({
      id: uniqueId(),
      type: WidgetType.STRUCT,
      structId: struct.id,
      collapsed: true,
    })
  }

  async function addBuiltinWidget(type: string) {
    setOpen(false)
    await store.area.addWidget({
      id: uniqueId(),
      collapsed: true,
      type,
    })
  }

  return (
    <>
      <Button
        size="xs"
        variant="default"
        disabled={isLoading}
        className="rounded-full"
        onClick={() => setOpen(true)}
      >
        <Trans>Add</Trans>
      </Button>

      <Drawer open={open} setOpen={setOpen} isFullHeight className="pb-0">
        <DrawerHeader>
          <DrawerTitle>
            <Trans>Edit widgets</Trans>
          </DrawerTitle>
        </DrawerHeader>

        <div className="-mx-4 flex flex-1 flex-col gap-2 overflow-auto px-4 pb-4">
          <Card className="mb-2">
            {Object.values(WidgetType)
              .filter(
                (i) =>
                  ![
                    WidgetType.RECENTLY_OPENED,
                    WidgetType.COLLECTION,
                    WidgetType.AI_CHAT,
                  ].includes(i),
              )
              .map((item) => {
                // if (
                //   item === WidgetType.COLLECTION ||
                //   item === WidgetType.RECENTLY_OPENED
                // ) {
                //   return null
                // }
                const getName = () => {
                  if (item === WidgetType.JOURNAL) {
                    return <Trans>Journals</Trans>
                  }

                  if (item === WidgetType.ALL_CREATIONS) {
                    return <Trans>All creations</Trans>
                  }
                  if (item === WidgetType.ALL_STRUCTS) {
                    return <Trans>All structs</Trans>
                  }

                  if (item === WidgetType.COLLECTION) {
                    return <Trans>Collection</Trans>
                  }

                  if (item === WidgetType.FAVORITES) {
                    return <Trans>Favorites</Trans>
                  }

                  if (item === WidgetType.RECENTLY_EDITED) {
                    return <Trans>Recently edited</Trans>
                  }
                  if (item === WidgetType.AI_CHAT) {
                    return <Trans>AI chat</Trans>
                  }
                  if (item === WidgetType.RECENTLY_OPENED) {
                    return <Trans>Recently opened</Trans>
                  }
                  if (item === WidgetType.ALL_TAGS) {
                    return <Trans>Tags</Trans>
                  }
                  return null
                }
                if (item === WidgetType.STRUCT) return null

                return (
                  <CardItem
                    key={item}
                    className="flex gap-2"
                    onClick={async () => {
                      await addBuiltinWidget(item)
                    }}
                  >
                    <WidgetIcon type={item} structs={structs} />
                    {getName()}
                  </CardItem>
                )
              })}
          </Card>

          <div className="text-foreground/50 px-4 py-2 text-xs">
            <Trans>Structs</Trans>
          </div>

          <Card>
            {structs.map((item) => {
              return (
                <CardItem
                  key={item.id}
                  className="flex gap-2"
                  onClick={async () => {
                    await addStructWidget(item)
                  }}
                >
                  {getCreationIcon(item.type)}
                  <span>
                    <StructName struct={item} />
                  </span>
                </CardItem>
              )
            })}
          </Card>
        </div>
      </Drawer>
    </>
  )
}
