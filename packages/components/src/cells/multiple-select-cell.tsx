import { useEffect, useState } from 'react'
import {
  CustomCell,
  CustomRenderer,
  getMiddleCenterBias,
  GridCellKind,
  measureTextCached,
  Rectangle,
} from '@glideapps/glide-data-grid'
import { Command } from 'cmdk'
import { Column } from '@penx/db/client'
import { getColorByName } from '@penx/libs/color-helper'
import { Option } from '@penx/types'
import { OptionTag } from '../OptionTag'
import { useDatabaseContext } from '../struct-database-ui/DatabaseProvider'
import { roundedRect } from './draw-fns'
import {
  CommandGroup,
  CommandInput,
  CommandItem,
} from './lib/select-cell-components'

interface MultipleSelectCellProps {
  kind: 'multiple-select-cell'
  readonly?: boolean
  column: Column
  options: Option[]
  data: string[] // options ids
  newOption?: Option
}

const tagHeight = 20
const innerPad = 6

export type MultipleSelectCell = CustomCell<MultipleSelectCellProps>

export const multipleSelectCellRenderer: CustomRenderer<MultipleSelectCell> = {
  kind: GridCellKind.Custom,
  isMatch: (c): c is MultipleSelectCell =>
    (c.data as any).kind === 'multiple-select-cell',
  draw: (args, cell) => {
    const { ctx, theme, rect } = args
    const { options = [] } = cell.data

    const drawArea: Rectangle = {
      x: rect.x + theme.cellHorizontalPadding,
      y: rect.y + theme.cellVerticalPadding,
      width: rect.width - 2 * theme.cellHorizontalPadding,
      height: rect.height - 2 * theme.cellVerticalPadding,
    }
    const rows = Math.max(
      1,
      Math.floor(drawArea.height / (tagHeight + innerPad)),
    )

    let x = drawArea.x
    let row = 1
    let y =
      drawArea.y +
      (drawArea.height - rows * tagHeight - (rows - 1) * innerPad) / 2
    for (const option of options) {
      const color = getColorByName(option.color)
      const tagName = option.name

      ctx.font = `12px ${theme.fontFamily}`
      const metrics = measureTextCached(tagName, ctx)
      const width = metrics.width + innerPad * 2
      const textY = tagHeight / 2

      if (
        x !== drawArea.x &&
        x + width > drawArea.x + drawArea.width &&
        row < rows
      ) {
        row++
        y += tagHeight + innerPad
        x = drawArea.x
      }

      ctx.fillStyle = color

      ctx.beginPath()
      roundedRect(ctx, x, y, width, tagHeight, tagHeight / 2)
      ctx.fill()

      // ctx.fillStyle = theme.textDark
      ctx.fillStyle = '#fff'
      ctx.fillText(
        tagName,
        x + innerPad,
        y + textY + getMiddleCenterBias(ctx, `12px ${theme.fontFamily}`),
      )

      x += width + 8
      if (x > drawArea.x + drawArea.width && row >= rows) break
    }

    return true
  },
  provideEditor: () => ({
    disablePadding: true,
    editor: (p) => {
      const {
        onChange,
        value,
        forceEditMode,
        validatedSelection,
        onFinishedEditing,
      } = p
      return (
        <Preview
          onChange={onChange}
          value={value}
          onFinishedEditing={onFinishedEditing}
        />
      )
    },
  }),
}

interface PreviewProps {
  value: MultipleSelectCell
  onChange: (newValue: MultipleSelectCell) => void
  onFinishedEditing: (
    newValue?: MultipleSelectCell,
    movement?: readonly [-1 | 0 | 1, -1 | 0 | 1],
  ) => void
}

function Preview({ onChange, value, onFinishedEditing }: PreviewProps) {
  const { column: field, options } = value.data
  const fieldOptions = (field.options as any as Option[]) || []
  // console.log('====options:', options, value)

  const { addOption } = useDatabaseContext()
  const [q, setQ] = useState('')
  const [search, setSearch] = useState('')
  // console.log('date value=====:', value)
  // console.log('>>>>>>>qu:', q, 'search:', search)

  const currentIds = options.map((o) => o.id)

  const filteredOptions = fieldOptions.filter((o) => {
    return o.name.toLowerCase().includes(search.toLowerCase())
  })

  if (search.length && filteredOptions.length === 0) {
    filteredOptions.push({
      id: 'CREATE',
      name: search,
    } as Option)
  }

  return (
    <Command
      label="Command Menu"
      value={q}
      onSelect={(v) => {
        // console.log('select value====:', v)
      }}
      onValueChange={(v) => {
        setQ(v)
      }}
      shouldFilter={false}
      filter={() => {
        return 1
      }}
    >
      <CommandInput
        autoFocus
        className=""
        placeholder="Find or create option"
        value={search}
        onValueChange={(v) => {
          setSearch(v)
        }}
      />
      <Command.List>
        <Command.Empty className="text-foreground/40 py-2 text-center">
          No results found.
        </Command.Empty>
        <CommandGroup heading={''}>
          {filteredOptions.map((item) => (
            <CommandItem
              key={item.id}
              onSelect={async (v) => {
                let id = item.id
                let newOption: Option = undefined as any
                if (item.id === 'CREATE') {
                  newOption = await addOption(field.id, search)
                  id = newOption.id
                }

                let newIds = value.data.data || []

                const existed = newIds.includes(id)
                if (!existed) {
                  newIds = [...newIds, id]
                } else {
                  newIds = newIds.filter((id2) => id2 !== id)
                }

                const newValue: MultipleSelectCell = {
                  ...value,
                  data: {
                    ...value.data,
                    data: newIds,
                    newOption,
                  },
                }

                setSearch('')
                onChange(newValue)
                onFinishedEditing(newValue)

                // console.log('====newIds:', newIds)
              }}
            >
              {item.id === 'CREATE' && (
                <div className="text-foreground/80 text-sm">Create</div>
              )}

              <OptionTag
                option={{
                  id: item.columnId,
                  name: item?.name,
                  color: item?.color,
                }}
                showClose={currentIds.includes(item.id)}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      </Command.List>
    </Command>
  )
}
