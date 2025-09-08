import { memo, useEffect } from 'react'
import { Box } from '@fower/react'
import { ListJSON } from '@penx/extension-api'
import { Separator } from '@penx/uikit/ui/separator'
import { useSearch } from '../../../hooks/useSearch'
import { useValue } from '../../../hooks/useValue'
import { CommandGroup } from '../CommandComponents'
import { ListItemUI } from '../ListItemUI'
import { DataListItem } from './DataListItem'

interface ListAppProps {
  component: ListJSON
}

export const ListApp = memo(function ListApp({ component }: ListAppProps) {
  const { value, setValue } = useValue()
  const { items, isShowingDetail, filtering, titleLayout } = component

  const currentItem = items.find((item) => item.title === value)!
  const dataList = currentItem?.detail?.items || []
  const { search } = useSearch()

  const filteredItems = !filtering
    ? items
    : items.filter((item) => {
        return item.title
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase())
      })
  useEffect(() => {
    const find = component.items.find((item) => item.title === value)
    if (!find) {
      const firstItem = component.items.find((item) => !item.type)
      firstItem && setValue(firstItem.title as string)
    }
  }, [component, value, setValue])

  const listJSX = (
    <CommandGroup className="flex-[2]">
      {filteredItems.sort().map((item, index) => {
        return (
          <ListItemUI
            // key={index}
            key={item.title.toString()}
            index={index}
            titleLayout={titleLayout}
            isListApp={true}
            item={item as any} // TODO: handle any
            onSelect={async () => {
              if (item.actions?.[0]) {
                const defaultAction = item.actions?.[0]
                if (defaultAction.type === 'OpenInBrowser') {
                  open(defaultAction.url)
                }
                if (defaultAction.type === 'CopyToClipboard') {
                  window.customElectronApi.clipboard.writeText(
                    defaultAction.content,
                  )
                }
              }
              console.log('list item:', item)
            }}
          />
        )
      })}
    </CommandGroup>
  )

  if (!isShowingDetail) {
    return listJSX
  }
  return (
    <div className="absolute inset-0 flex overflow-hidden">
      {listJSX}
      {isShowingDetail && (
        <>
          <Separator orientation="vertical" />
          <div className="command-app-list-detail flex-[3] overflow-auto p-3">
            <div className="mb-2 text-2xl font-bold">Detail</div>
            <div className="flex flex-col gap-1">
              {dataList.map((item) => (
                <DataListItem key={item.label} item={item} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
})
