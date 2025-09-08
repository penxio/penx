import { useState } from 'react'
import { Box } from '@fower/react'
import { appEmitter } from '@penx/emitter'
import { FilterItem } from '@penx/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@penx/uikit/select'

interface Props {
  filters: Record<string, FilterItem[]>
}
export const SearchBarFilter = ({ filters }: Props) => {
  const initialValue = Object.keys(filters).reduce(
    (acc, key) => {
      const find = filters[key].find((item) => item.selected)
      return {
        ...acc,
        [key]: find?.value ?? undefined,
      }
    },
    {} as Record<string, any>,
  )

  const [filterValue, setFilterValue] = useState(initialValue)

  return (
    <div className="mr-2 flex items-center gap-1">
      {Object.keys(filters).map((key) => {
        const items = filters[key]
        return (
          <FilterSelect
            key={key}
            value={filterValue[key]}
            items={items}
            onChange={(v) => {
              const newState = { ...filterValue, [key]: v }
              appEmitter.emit('ON_COMMAND_PALETTE_FILTER_CHANGE', newState)
              setFilterValue(newState)
            }}
          />
        )
      })}
    </div>
  )
}

interface FilterSelectProps {
  value: string
  onChange: (v: string) => void
  items: FilterItem[]
}
function FilterSelect({ value, onChange, items }: FilterSelectProps) {
  return (
    <Select value={value} onValueChange={(v: string) => onChange(v)}>
      <SelectTrigger className="w-[120px] flex-1 text-sm">
        <SelectValue flexShrink-0 placeholder=""></SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[240px] w-[200px] overflow-auto">
        {items.map((item) => (
          <SelectItem
            key={item.value + item.value.toString()}
            value={item.value as string}
            className="flex justify-between"
          >
            <div className="flex-1">{item.label}</div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
