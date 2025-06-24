import { ReactNode, useEffect, useState } from 'react'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { PlusIcon } from 'lucide-react'
import { widgetAtom } from '@penx/hooks/useWidget'
import { store } from '@penx/store'
import { Input } from '@penx/uikit/ui/input'
import { Drawer } from '../ui/Drawer'
import { DrawerHeader } from '../ui/DrawerHeader'
import { DrawerTitle } from '../ui/DrawerTitle'
import { MenuItem } from '../ui/MenuItem'

interface ItemProps {
  className?: string
  children?: React.ReactNode
  onClick?: () => void
  onCreated?: () => void
}
export function CreateArea({ children, className, onCreated }: ItemProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  useEffect(() => {
    if (open) setName('')
  }, [open])
  return (
    <>
      <MenuItem
        className="text-brand gap-2"
        onClick={() => {
          setOpen(true)
        }}
      >
        <PlusIcon />
        <span>
          <Trans>Create new area</Trans>
        </span>
      </MenuItem>
      <Drawer open={open} setOpen={setOpen} isFullHeight>
        <DrawerHeader
          showCancelButton
          onConfirm={async () => {
            const area = await store.areas.addArea({ name })
            store.area.set(area)
            store.set(widgetAtom, area.props.widgets[0])
            store.creations.refetchCreations(area.id)
            store.structs.refetchStructs(area.id)
            store.visit.setAndSave({ activeAreaId: area.id })
            await store.panels.resetPanels()
            setOpen(false)
            onCreated?.()
          }}
        >
          <DrawerTitle>
            <Trans>Create area</Trans>
          </DrawerTitle>
        </DrawerHeader>
        <Input
          autoFocus
          className="dark:bg-neutral-700"
          variant="filled"
          placeholder={t`Name`}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Drawer>
    </>
  )
}
