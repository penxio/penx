import { useEffect, useMemo } from 'react'
import { Box } from '@fower/react'
import { Trans } from '@lingui/react/macro'
import { Struct } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
import { useCreations } from '@penx/hooks/useCreations'
import { IStructNode } from '@penx/model-type'
import { store } from '@penx/store'
import { Separator } from '@penx/uikit/ui/separator'
import { mappedByKey } from '@penx/utils'
import { docToString } from '@penx/utils/editorHelper'
import { currentCreationAtom } from '~/hooks/useCurrentCreation'
import { useValue } from '~/hooks/useValue'
import { ICommandItem } from '~/lib/types'
import { StyledCommandEmpty, StyledCommandGroup } from '../../CommandComponents'
import { ListItemUI } from '../../ListItemUI'
import { RowProps } from './RowProps'

interface Props {
  text: string
  struct: IStructNode
}

export function DatabaseDetail(props: Props) {
  const { value, setValue } = useValue()
  const { creations } = useCreations()
  const { text } = props
  const struct = new Struct(props.struct)
  const rows = creations.filter((c) => c.structId === struct.id)

  const currentView = struct.views[0]
  const viewColumns = currentView.viewColumns
  const columnMap = mappedByKey(struct.columns, 'id')
  const sortedColumns = viewColumns.map(({ columnId }) => columnMap[columnId])

  const filteredRows = useMemo(() => {
    const t = text.toLowerCase()
    if (!text) return rows.slice(0, 20)
    return rows.filter((row) => {
      if (row.title.toLowerCase().includes(t)) return true

      const contentStr = docToString(JSON.parse(row.content))
      if (contentStr.toLowerCase().includes(t)) return true

      if (!row.cells) {
        return false
      }
      const values: string[] = Object.values(row.cells)

      return values.some((v) => {
        if (typeof v === 'string') {
          return v.toLowerCase().includes(t)
        }
        return JSON.stringify(v).toLowerCase().includes(t)
      })
    })
  }, [rows, text, sortedColumns])

  useEffect(() => {
    if (filteredRows.length) {
      setValue(filteredRows[0].id)
    }
  }, [])

  useEffect(() => {
    const handle = (id: string) => {
      if (filteredRows.length) {
        const newValue =
          filteredRows[0].id === id ? filteredRows[1].id : filteredRows[0].id
        setValue(newValue)

        appEmitter.emit('FOCUS_SEARCH_BAR_INPUT')
      }
    }

    appEmitter.on('DELETE_CREATION_SUCCESS', handle)

    return () => {
      appEmitter.off('DELETE_CREATION_SUCCESS', handle)
    }
  }, [filteredRows])

  // console.log('=======filteredRows:', filteredRows, 'value:', value)
  const currentItem = filteredRows.find((item) => item.id === value)

  if (currentItem) {
    store.set(currentCreationAtom, currentItem.raw)
  }

  if (!filteredRows.length) {
    return (
      <div className="text-foreground/50 pl-1">
        <Trans>No results found</Trans>
      </div>
    )
    // return (
    //   <StyledCommandGroup>
    //     <StyledCommandEmpty>No results found.</StyledCommandEmpty>
    //   </StyledCommandGroup>
    // )
  }

  return (
    <Box toLeft overflowHidden absolute top0 bottom0 left0 right0>
      <StyledCommandGroup p2 flex-2 overflowYAuto>
        {filteredRows.map((item, index) => {
          const listItem = {
            title: item.title || item.previewedContent,
          } as ICommandItem
          return (
            <ListItemUI
              key={index}
              index={index}
              showIcon={false}
              value={item.id}
              item={listItem}
            />
          )
        })}
      </StyledCommandGroup>

      <Separator orientation="vertical" />

      <Box className="flex flex-col overflow-auto" flex-3>
        {currentItem && (
          <RowProps
            struct={struct}
            creation={currentItem}
            sortedColumns={sortedColumns}
          />
        )}
      </Box>
    </Box>
  )
}

function dataToString(data: any) {
  if (!data) return 'Untitled'
  if (typeof data === 'string') return data
  if (typeof data === 'number') return data.toString()
  if (Array.isArray(data)) return data.join(',')
  return JSON.stringify(data, null)
}

function isUuidV4(uuid: string): boolean {
  const uuidV4Regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidV4Regex.test(uuid)
}
