import { memo, useEffect } from 'react'
import { Box } from '@fower/react'
import { ListJSON } from '@penx/extension-api'
import { Separator } from '@penx/uikit/ui/separator'
import { useSearch } from '~/hooks/useSearch'
import { useValue } from '~/hooks/useValue'
import { StyledCommandGroup } from '../CommandComponents'
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
    <StyledCommandGroup flex-2>
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
    </StyledCommandGroup>
  )

  if (!isShowingDetail) {
    return listJSX
  }
  return (
    <Box toLeft overflowHidden absolute top0 bottom0 left0 right0>
      {listJSX}
      {isShowingDetail && (
        <>
          <Separator orientation="vertical" />
          <Box className="command-app-list-detail" flex-3 overflowAuto p3>
            <Box text2XL fontBold mb2>
              Detail
            </Box>
            <Box column gap1>
              {dataList.map((item) => (
                <DataListItem key={item.label} item={item} />
              ))}
            </Box>
          </Box>
        </>
      )}
    </Box>
  )
})
