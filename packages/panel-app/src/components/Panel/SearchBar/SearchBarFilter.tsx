import { useState } from 'react'
import { Box } from '@fower/react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@penx/uikit/select'
import { appEmitter } from '@penx/emitter'
import { FilterItem } from '@penx/types'

interface Props {
  filters: Record<string, FilterItem[]>
}
export const SearchBarFilter = ({ filters }: Props) => {
  const initialValue = Object.keys(filters).reduce(
    (acc, key) => {
      const find = filters[key].find((item) => item.selected)
      return {
        ...acc,
        [key]: find?.value ?? undefined
      }
    },
    {} as Record<string, any>
  )

  const [filterValue, setFilterValue] = useState(initialValue)

  return (
    <Box mr2 toCenterY gap1>
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
    </Box>
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
      <SelectTrigger className="flex-1 text-sm w-[120px]">
        <SelectValue flexShrink-0 placeholder=""></SelectValue>
      </SelectTrigger>
      <SelectContent className="w-[200px] max-h-[240px] overflow-auto">
        {items.map((item) => (
          <SelectItem
            key={item.value + item.value.toString()}
            value={item.value as string}
            className="flex justify-between"
          >
            <Box flex-1>{item.label}</Box>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
