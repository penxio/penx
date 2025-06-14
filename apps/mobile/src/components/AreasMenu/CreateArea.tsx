import { ReactNode, useEffect, useState } from 'react'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { PlusIcon } from 'lucide-react'
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
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  useEffect(() => {
    if (isOpen) setName('')
  }, [isOpen])
  return (
    <>
      <MenuItem
        className="text-brand gap-2"
        onClick={() => {
          setIsOpen(true)
        }}
      >
        <PlusIcon />
        <span>
          <Trans>Create new area</Trans>
        </span>
      </MenuItem>
      <Drawer open={isOpen} setOpen={setIsOpen} isFullHeight>
        <DrawerHeader
          showCancelButton
          onConfirm={async () => {
            const area = await store.areas.addArea({ name })
            store.area.set(area)
            store.creations.refetchCreations(area.id)
            store.structs.refetchStructs(area.id)
            store.visit.setAndSave({ activeAreaId: area.id })
            await store.panels.resetPanels()
            setIsOpen(false)
            onCreated?.()
          }}
        >
          <DrawerTitle>
            <Trans>Create area</Trans>
          </DrawerTitle>
        </DrawerHeader>
        <Input
          autoFocus
          className=""
          variant="filled"
          placeholder={t`Name`}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Drawer>
    </>
  )
}
