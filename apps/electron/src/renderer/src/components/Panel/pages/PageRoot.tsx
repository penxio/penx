import { ReactNode, useEffect, useRef } from 'react'
import { Trans } from '@lingui/react/macro'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Separator } from '@penx/uikit/ui/separator'
import { useActionPopover } from '~/hooks/useActionPopover'
import { useHandleSelect } from '~/hooks/useHandleSelect'
import { useItems } from '~/hooks/useItems'
import { useSelectStruct } from '~/hooks/useSelectStruct'
import { useValue } from '~/hooks/useValue'
import { ICommandItem } from '~/lib/types'
import { CommandGroup, CommandList } from '../CommandComponents'
import { CreationDetail } from '../CreationDetail'
import { ListItemUI } from '../ListItemUI'

export function PageRoot() {
  const { commandItems, favorItems, structItems, creationItems, items } =
    useItems()
  const { value } = useValue()
  const selectStruct = useSelectStruct()
  const handleSelect = useHandleSelect()
  const { setOpen } = useActionPopover()

  const currentItem = items.find(
    (item) => item.id === value && item.data.type === 'Creation',
  )

  const parentRef = useRef<HTMLDivElement>(null)

  const groupConfigs = [
    {
      heading: <Trans>Favorites</Trans>,
      items: favorItems,
      onSelect: (item: ICommandItem) => {
        if (item.data?.struct) {
          selectStruct(item)
        } else {
          handleSelect(item)
        }
      },
    },
    {
      heading: <Trans>Structs</Trans>,
      items: structItems,
      onSelect: (item: ICommandItem) => selectStruct(item),
    },
    {
      heading: <Trans>Commands</Trans>,
      items: commandItems,
      onSelect: (item: ICommandItem) => handleSelect(item),
    },
    {
      heading: <Trans>Creations</Trans>,
      items: creationItems,
      onSelect: (item: ICommandItem) => handleSelect(item),
    },
  ]

  // Flatten groups into a single array with group headers
  const flatList: Array<
    | { type: 'header'; groupIdx: number }
    | { type: 'item'; groupIdx: number; item: ICommandItem; itemIdx: number }
  > = []

  groupConfigs
    // .filter((g) => g.items.length > 0)
    .forEach((group, groupIdx) => {
      if (group.items.length) {
        flatList.push({ type: 'header', groupIdx })
        group.items.forEach((item, itemIdx) => {
          flatList.push({ type: 'item', groupIdx, item, itemIdx })
        })
      }
    })

  const rowVirtualizer = useVirtualizer({
    count: flatList.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (i) => (flatList[i].type === 'header' ? 28 : 38),
    overscan: 10,
  })

  useEffect(() => {
    const currentIndex = flatList.findIndex(
      (row) => row.type === 'item' && row.item.id === value,
    )
    if (currentIndex === 1 && flatList[0]?.type === 'header') {
      rowVirtualizer.scrollToIndex(0, { align: 'start' })
    }
  }, [value, flatList, rowVirtualizer])

  return (
    <CommandList className="absolute inset-0 flex overflow-hidden p-2 outline-none">
      <div className="absolute inset-0 flex overflow-hidden">
        <div
          ref={parentRef}
          className="flex-[2] overflow-auto px-2 pb-2"
          style={{
            overscrollBehavior: 'contain',
            scrollPaddingBlockStart: 8,
            scrollPaddingBlockEnd: 8,
            position: 'relative',
          }}
        >
          <CommandGroup
            style={{
              height: rowVirtualizer.getTotalSize(),
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = flatList[virtualRow.index]

              if (row.type === 'header') {
                const group = groupConfigs[row.groupIdx]
                return (
                  <div
                    key={`header-${row.groupIdx}`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: 32,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="text-foreground/60 z-10 flex items-center px-2 text-xs font-bold"
                  >
                    {group.heading}
                  </div>
                )
              } else {
                const group = groupConfigs[row.groupIdx]
                return (
                  <div
                    key={row.item.id}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: 38,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <ListItemUI
                      index={row.itemIdx}
                      value={row.item.id}
                      item={row.item}
                      onSelect={group.onSelect}
                      onContextMenu={() => setOpen(true)}
                    />
                  </div>
                )
              }
            })}
          </CommandGroup>
        </div>

        {currentItem?.data?.creation && (
          <>
            <Separator orientation="vertical" />
            <div className="flex flex-[3] flex-col overflow-auto">
              <CreationDetail creation={currentItem.data.creation!} />
            </div>
          </>
        )}
      </div>
    </CommandList>
  )
}
