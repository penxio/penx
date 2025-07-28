import { useEffect, useMemo } from 'react'
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
import { CommandEmpty, CommandGroup } from '../../CommandComponents'
import { CreationDetail } from '../../CreationDetail'
import { ListItemUI } from '../../ListItemUI'

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

  const filteredRows = useMemo(() => {
    const t = text.toLowerCase()
    if (!text) return rows.slice(0, 20)
    return rows.filter((row) => {
      if (row.title.toLowerCase().includes(t)) return true

      const contentStr = docToString(row.content)
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
  }, [rows, text])

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
    <div className="absolute inset-0 flex overflow-hidden">
      <CommandGroup className="flex-[2] overflow-auto p-2">
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
      </CommandGroup>

      <Separator orientation="vertical" />

      <div className="flex flex-[3] flex-col overflow-auto">
        {currentItem && <CreationDetail creation={currentItem} />}
      </div>
    </div>
  )
}
