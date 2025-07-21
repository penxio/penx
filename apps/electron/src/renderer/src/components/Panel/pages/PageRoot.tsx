import { useCreations } from '@penx/hooks/useCreations'
import { Separator } from '@penx/uikit/ui/separator'
import { docToString } from '@penx/utils/editorHelper'
import { useActionPopover } from '~/hooks/useActionPopover'
import { useHandleSelect } from '~/hooks/useHandleSelect'
import { useItems } from '~/hooks/useItems'
import { useSearch } from '~/hooks/useSearch'
import { useSelectStruct } from '~/hooks/useSelectStruct'
import { useValue } from '~/hooks/useValue'
import { creationToCommand } from '~/lib/creationToCommand'
import { CommandGroup, CommandList } from '../CommandComponents'
import { CreationDetail } from '../CreationDetail'
import { ListItemUI } from '../ListItemUI'

export function PageRoot() {
  const { commandItems } = useItems()
  const { value, setValue } = useValue()
  const selectStruct = useSelectStruct()
  const { search } = useSearch()
  const handleSelect = useHandleSelect()
  const { creations } = useCreations()
  const { setOpen } = useActionPopover()

  const filteredCreations = creations
    .filter((row) => {
      if (!search) return false
      const t = search.toLowerCase()

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
    .slice(0, 20)

  const creationCommands = filteredCreations.map((c) => creationToCommand(c))

  const lists = [...commandItems, ...creationCommands]
  const currentItem = lists.find(
    (item) => item.id === value && item.data.type === 'Creation',
  )

  return (
    <CommandList className="absolute inset-0 flex overflow-hidden p-2 outline-none">
      <div className="absolute inset-0 flex overflow-hidden">
        <CommandGroup heading={''} className="flex-[2] overflow-auto p-2">
          {lists.map((item, index) => {
            return (
              <ListItemUI
                key={index}
                index={index}
                value={item.id || item.data.commandName}
                item={item}
                onSelect={(item) => {
                  if (!!item.data?.struct) {
                    selectStruct(item)
                  } else {
                    handleSelect(item)
                  }
                }}
                onContextMenu={() => {
                  setOpen(true)
                }}
              />
            )
          })}
        </CommandGroup>

        {currentItem && (
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
