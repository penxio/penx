import React, { useEffect, useState } from 'react'
import isEqual from 'react-fast-compare'
import { Card } from '@/components/ui/Card'
import { Drawer } from '@/components/ui/Drawer'
import { DrawerHeader } from '@/components/ui/DrawerHeader'
import { DrawerTitle } from '@/components/ui/DrawerTitle'
import { Menu } from '@/components/ui/Menu'
import { MenuItem } from '@/components/ui/MenuItem'
import { MobileInput } from '@/components/ui/MobileInput'
import { MobileSelect } from '@/components/ui/MobileSelect'
import { Trans } from '@lingui/react/macro'
import { ColumnTypeName } from '@penx/components/ColumnTypeName'
import { FieldIcon } from '@penx/components/FieldIcon'
import { RepeatTypes } from '@penx/constants'
import { Struct } from '@penx/domain'
import { store } from '@penx/store'
import { ColumnType } from '@penx/types'
import { OptionList } from './OptionList'
import { useEditPropertyDrawer } from './useEditPropertyDrawer'

export function EditPropertyDrawer({ struct }: { struct: Struct }) {
  const { isOpen, setIsOpen, column } = useEditPropertyDrawer()
  const [name, setName] = useState(column?.name || '')
  const [description, setDescription] = useState(column?.description || '')
  const [config, setConfig] = useState(column?.config || {})

  useEffect(() => {
    if (name !== column?.name) setName(column?.name)
  }, [column?.name, setName])

  useEffect(() => {
    if (description !== column?.description) setDescription(column?.description)
  }, [column?.description, setDescription])

  useEffect(() => {
    if (!isEqual(config, column?.config)) setConfig(column?.config)
  }, [column?.config, setConfig])

  if (!column) return null

  return (
    <Drawer open={isOpen} setOpen={setIsOpen} isFullHeight>
      <DrawerHeader
        disabled={!name}
        showCancelButton
        onConfirm={async () => {
          if (!name) return null
          await store.structs.updateColumn(struct, column.id, {
            name,
            description,
            config,
          })

          setIsOpen(false)
        }}
      >
        <DrawerTitle>
          <Trans>Edit property</Trans>
        </DrawerTitle>
      </DrawerHeader>
      <div className="space-y-2">
        <div className="flex">
          <div className="bg-background/8 text-foreground flex items-center gap-2 rounded-full">
            <FieldIcon columnType={column.columnType} className="" />
            <ColumnTypeName className="" columnType={column.columnType} />
          </div>
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

      {(column.columnType === ColumnType.SINGLE_SELECT ||
        column.columnType === ColumnType.MULTIPLE_SELECT) && (
        <div className="mt-6 space-y-2">
          <div>
            <Trans>Options</Trans>
          </div>
          <OptionList column={column} struct={struct} />
        </div>
      )}

      {column.columnType === ColumnType.REMINDER && (
        <div className="mt-6 space-y-2">
          <div>
            <Trans>Config</Trans>
          </div>
          <Card>
            <MobileSelect
              options={[
                {
                  label: <Trans>On time</Trans>,
                  value: 0,
                },
                {
                  label: <Trans> 5 minutes early</Trans>,
                  value: 1000 * 60 * 5,
                },
                {
                  label: <Trans>30 minutes early</Trans>,
                  value: 1000 * 60 * 30,
                },
                {
                  label: <Trans>1 hour early</Trans>,
                  value: 1000 * 60 * 60,
                },
                {
                  label: <Trans>1 day early</Trans>,
                  value: 1000 * 60 * 60 * 24,
                },
                {
                  label: <Trans>1 week early</Trans>,
                  value: 1000 * 60 * 60 * 24 * 7,
                },
              ]}
              label={<Trans>when to remind?</Trans>}
              value={config?.aheadTimes || 0}
              onChange={(v) => {
                setConfig({
                  ...config,
                  aheadTimes: v,
                })
              }}
            />

            <MobileSelect
              options={[
                {
                  label: <Trans>None</Trans>,
                  value: RepeatTypes.NONE,
                },
                {
                  label: <Trans>Daily</Trans>,
                  value: RepeatTypes.DAILY,
                },
                {
                  label: <Trans>Weekly</Trans>,
                  value: RepeatTypes.WEEKLY,
                },
                {
                  label: <Trans>Monthly</Trans>,
                  value: RepeatTypes.MONTHLY,
                },
                {
                  label: <Trans>Yearly</Trans>,
                  value: RepeatTypes.YEARLY,
                },
              ]}
              label={<Trans>Repeat</Trans>}
              value={config?.repeat || RepeatTypes.NONE}
              onChange={(v) => {
                setConfig({
                  ...config,
                  repeat: v,
                })
              }}
            />
          </Card>
        </div>
      )}
    </Drawer>
  )
}
