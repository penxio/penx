import React, { useEffect, useState } from 'react'
import { Drawer } from '@/components/ui/Drawer'
import { DrawerHeader } from '@/components/ui/DrawerHeader'
import { DrawerTitle } from '@/components/ui/DrawerTitle'
import { Menu } from '@/components/ui/Menu'
import { MobileInput } from '@/components/ui/MobileInput'
import { Trans } from '@lingui/react/macro'
import { ColumnTypeName } from '@penx/components/ColumnTypeName'
import { Struct } from '@penx/domain'
import { store } from '@penx/store'
import { ColumnType } from '@penx/types'
import { useEditPropertyDrawer } from './useEditPropertyDrawer'

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

export function EditPropertyDrawer({ struct }: { struct: Struct }) {
  const { isOpen, setIsOpen, column } = useEditPropertyDrawer()
  const [columnType, setColumnType] = useState(ColumnType.TEXT)
  const [name, setName] = useState(column?.name || '')
  const [description, setDescription] = useState(column?.description || '')

  useEffect(() => {
    if (name !== column?.name) setName(column?.name)
  }, [column?.name, setName])

  useEffect(() => {
    if (description !== column?.description) setDescription(column?.description)
  }, [column?.description, setDescription])

  if (!column) return null

  return (
    <Drawer open={isOpen} setOpen={setIsOpen} isFullHeight>
      <DrawerHeader
        disabled={!name}
        onConfirm={async () => {
          if (!name) return null
          await store.structs.addColumn(struct, {
            columnType,
            name,
            description,
          })
          setIsOpen(false)
          setTimeout(() => {
            setName('')
            setDescription('')
          }, 0)
        }}
      >
        <DrawerTitle>
          <Trans>Edit property</Trans>
        </DrawerTitle>
      </DrawerHeader>
      <div className="space-y-2">
        <div>
          <ColumnTypeName columnType={columnType} />
        </div>
        <Menu>
          <MobileInput
            isRequired
            value={name}
            onChange={(e) => setName(e.target.value)}
            label={<Trans>Name</Trans>}
          />
          <MobileInput
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            label={<Trans>Description</Trans>}
          />
        </Menu>
      </div>
    </Drawer>
  )
}
