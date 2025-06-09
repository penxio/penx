import React, { useState } from 'react'
import { Drawer } from '@/components/ui/Drawer'
import { DrawerHeader } from '@/components/ui/DrawerHeader'
import { DrawerTitle } from '@/components/ui/DrawerTitle'
import { Menu } from '@/components/ui/Menu'
import { MenuItem } from '@/components/ui/MenuItem'
import { MobileInput } from '@/components/ui/MobileInput'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { PlusIcon } from 'lucide-react'
import { toast } from 'sonner'
import { ColumnTypeName } from '@penx/components/ColumnTypeName'
import { FieldIcon } from '@penx/components/FieldIcon'
import { Struct } from '@penx/domain'
import { store } from '@penx/store'
import { ColumnType } from '@penx/types'

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

export function AddOptionButton({ struct }: { struct: Struct }) {
  const [open, setOpen] = useState(false) // for select property type
  const [visible, setVisible] = useState(false) // for add property from
  const [columnType, setColumnType] = useState(ColumnType.TEXT)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  return (
    <>
      <div
        className="text-brand flex h-12 items-center gap-1 px-2"
        onClick={() => setOpen(true)}
      >
        <PlusIcon size={20} />
        <div>
          <Trans>Add property</Trans>
        </div>
      </div>
      <Drawer open={open} setOpen={setOpen}>
        <DrawerHeader>
          <DrawerTitle>
            <Trans>Select Property type</Trans>
          </DrawerTitle>
        </DrawerHeader>
        <Menu>
          {types.map((type) => (
            <MenuItem
              key={type}
              onClick={() => {
                setOpen(false)
                setVisible(true)
                setColumnType(type)
              }}
            >
              <div className="flex items-center gap-2">
                <FieldIcon columnType={type} />
                <ColumnTypeName columnType={type} />
              </div>
            </MenuItem>
          ))}
        </Menu>
      </Drawer>

      <Drawer open={visible} setOpen={setVisible} isFullHeight>
        <DrawerHeader
          disabled={!name}
          onConfirm={async () => {
            if (!name) return null
            await store.structs.addColumn(struct, {
              columnType,
              name,
              description,
            })
            toast.info(t`Property added successfully!`)
            setVisible(false)
            setName('')
            setDescription('')
          }}
        >
          <DrawerTitle>
            <Trans>New property</Trans>
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
    </>
  )
}
