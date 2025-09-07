import { useEffect, useMemo } from 'react'
import { Trans } from '@lingui/react/macro'
import { Struct } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
import { useCreations } from '@penx/hooks/useCreations'
import { IStructNode } from '@penx/model-type'
import { store } from '@penx/store'
import { Separator } from '@penx/uikit/ui/separator'
import { cn } from '@penx/utils'
import { docToString } from '@penx/utils/editorHelper'
import { currentCreationAtom } from '../../../../hooks/useCurrentCreation'
import { usePanel } from '../../../../hooks/usePanel'
import { useValue } from '../../../../hooks/useValue'
import { CommandEmpty, CommandGroup } from '../../CommandComponents'
import { CreationDetail } from '../../CreationDetail'
import { StructCommandList } from './StructCommandList'
import { TaskCommandList } from './TaskCommandList'

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
  const { isSidepanel } = usePanel()

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

  // console.log('=======currentItem:', currentItem)

  if (currentItem) {
    store.set(currentCreationAtom, currentItem.raw)
  }

  if (!filteredRows.length) {
    return (
      <div className="text-foreground/50 pl-3 pt-2 text-sm">
        <Trans>No results found</Trans>
      </div>
    )
    // return (
    //   <CommandGroup>
    //     <CommandEmpty>No results found.</CommandEmpty>
    //   </CommandGroup>
    // )
  }

  return (
    <div className="absolute inset-0 flex overflow-hidden">
      {struct.isTask ? (
        <TaskCommandList creations={filteredRows} struct={struct} />
      ) : (
        <StructCommandList creations={filteredRows} struct={struct} />
      )}

      {struct.showDetail && !isSidepanel && (
        <>
          <Separator orientation="vertical" />

          <div
            className={cn(
              'flex flex-[3] flex-col overflow-auto',
              struct.isTask && 'flex-2',
            )}
          >
            {currentItem && <CreationDetail creation={currentItem} />}
          </div>
        </>
      )}
    </div>
  )
}
