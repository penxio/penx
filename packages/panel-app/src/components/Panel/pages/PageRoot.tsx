import { ReactNode, useEffect, useMemo, useRef } from 'react'
import { Trans } from '@lingui/react/macro'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useArea } from '@penx/hooks/useArea'
import { useStructs } from '@penx/hooks/useStructs'
import { Separator } from '@penx/uikit/ui/separator'
import { useActionPopover } from '../../../hooks/useActionPopover'
import { useHandleSelect } from '../../../hooks/useHandleSelect'
import { useItems } from '../../../hooks/useItems'
import { usePanel } from '../../../hooks/usePanel'
import { useSearch } from '../../../hooks/useSearch'
import { useSelectStruct } from '../../../hooks/useSelectStruct'
import { useValue } from '../../../hooks/useValue'
import { ICommandItem } from '../../../lib/types'
import { CommandGroup, CommandList } from '../CommandComponents'
import { CreationDetail } from '../CreationDetail'
import { ListItemUI } from '../ListItemUI'

export function PageRoot() {
  const { commandItems, favorItems, structItems, creationItems, items } =
    useItems()

  const { value, setValue } = useValue()
  const { search } = useSearch()
  const selectStruct = useSelectStruct()
  const handleSelect = useHandleSelect()
  const { setOpen } = useActionPopover()
  const { area } = useArea()
  const { structs } = useStructs()
  const { isSidepanel } = usePanel()

  const currentItem = items.find(
    (item) => item.id === value && item.data.type === 'Creation',
  )

  const struct = useMemo(() => {
    if (!currentItem?.data?.creation) return null
    const item = structs.find(
      (s) => s.id === currentItem?.data.creation?.structId,
    )
    return item
  }, [currentItem?.data?.creation, structs])

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
  const flatList: Array<{
    type: 'item'
    groupIdx: number
    item: ICommandItem
    itemIdx: number
  }> = []

  groupConfigs
    // .filter((g) => g.items.length > 0)
    .forEach((group, groupIdx) => {
      if (group.items.length) {
        // flatList.push({ type: 'header', groupIdx })
        group.items.forEach((item, itemIdx) => {
          flatList.push({ type: 'item', groupIdx, item, itemIdx })
        })
      }
    })

  // console.log('======flatList:', flatList, value)

  const rowVirtualizer = useVirtualizer({
    count: flatList.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (i) => 38,
    overscan: 6,
  })

  // useEffect(() => {
  //   const currentIndex = flatList.findIndex(
  //     (row) => row.type === 'item' && row.item.id === value,
  //   )
  //   if (currentIndex === 1 && flatList[0]?.type === 'header') {
  //     rowVirtualizer.scrollToIndex(0, { align: 'start' })
  //   }
  // }, [value, flatList, rowVirtualizer])

  useEffect(() => {
    if (!search && flatList[0]) {
      setValue(flatList[0].item.id)
      rowVirtualizer.scrollToIndex(0, { align: 'start' })
    }
  }, [search])

  return (
    <CommandList className="absolute inset-0 flex overflow-hidden outline-none">
      <div className="absolute inset-0 flex w-full overflow-hidden">
        <div
          ref={parentRef}
          className="flex-[2] overflow-auto px-2 py-2"
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
              const group = groupConfigs[row.groupIdx]
              return (
                <ListItemUI
                  key={row.item.id}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: 38,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  index={row.itemIdx}
                  value={row.item.id}
                  isFavorite={area.favorCommands.includes(row.item.id)}
                  item={row.item}
                  onSelect={group.onSelect}
                  onContextMenu={() => setOpen(true)}
                />
              )
            })}
          </CommandGroup>
        </div>

        {currentItem?.data?.creation && struct?.showDetail && !isSidepanel && (
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
