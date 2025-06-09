import React, { useEffect, useState } from 'react'
import { Drawer } from '@/components/ui/Drawer'
import { DrawerHeader } from '@/components/ui/DrawerHeader'
import { DrawerTitle } from '@/components/ui/DrawerTitle'
import { Menu } from '@/components/ui/Menu'
import { MenuItem } from '@/components/ui/MenuItem'
import { MobileInput } from '@/components/ui/MobileInput'
import { Trans } from '@lingui/react/macro'
import { ColumnTypeName } from '@penx/components/ColumnTypeName'
import { Struct } from '@penx/domain'
import { store } from '@penx/store'
import { ColumnType } from '@penx/types'
import { ColorSelector } from './ColorSelector'
import { OptionList } from './OptionList'
import { useEditPropertyDrawer } from './useEditPropertyDrawer'
import { useOptionDrawer } from './useOptionDrawer'

const types = [
  ColumnType.TEXT,
  ColumnType.NUMBER,
  ColumnType.SINGLE_SELECT,
  ColumnType.MULTIPLE_SELECT,
  ColumnType.RATE,
  ColumnType.URL,
  ColumnType.PASSWORD,
  ColumnType.DATE,
  ColumnType.CREATED_AT,
  ColumnType.UPDATED_AT,
]

export function OptionDrawer({ struct }: { struct: Struct }) {
  const { isOpen, setIsOpen, option, column } = useOptionDrawer()
  const propertyDrawer = useEditPropertyDrawer()
  const [name, setName] = useState(option?.name || '')
  const [color, setColor] = useState(option?.color || '')

  useEffect(() => {
    if (name !== option?.name) setName(option?.name)
  }, [option?.name, setName])

  useEffect(() => {
    if (color !== option?.color) setColor(option?.color)
  }, [option?.color, setColor])

  if (!option) return null

  return (
    <Drawer open={isOpen} setOpen={setIsOpen} isFullHeight>
      <DrawerHeader
        disabled={!name}
        onConfirm={async () => {
          if (!name) return null

          const newColumns = await store.structs.updateOption(
            struct,
            column.id,
            option.id,
            {
              name,
              color,
            },
          )
          const newColumn = newColumns.find((c) => c.id === column.id)
          propertyDrawer.setState({
            isOpen: true,
            column: newColumn!,
          })

          setIsOpen(false)
        }}
      >
        <DrawerTitle>
          {option ? <Trans>Edit Option</Trans> : <Trans>Add Option</Trans>}
        </DrawerTitle>
      </DrawerHeader>
      <div className="space-y-2">
        <Menu>
          <MobileInput
            isRequired
            value={name}
            onChange={(e) => setName(e.target.value)}
            label={<Trans>Name</Trans>}
          />
        </Menu>

        <div className="mt-6">
          <ColorSelector value={color} onChange={setColor} />
        </div>
      </div>
    </Drawer>
  )
}
