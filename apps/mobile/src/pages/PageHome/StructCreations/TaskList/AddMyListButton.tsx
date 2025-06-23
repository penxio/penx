import React, { useState } from 'react'
import { Drawer } from '@/components/ui/Drawer'
import { DrawerHeader } from '@/components/ui/DrawerHeader'
import { DrawerTitle } from '@/components/ui/DrawerTitle'
import { impact } from '@/lib/impact'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { PlusIcon } from 'lucide-react'
import { useStructs } from '@penx/hooks/useStructs'
import { store } from '@penx/store'
import { Input } from '@penx/uikit/ui/input'

interface Props {}

export const AddMyListButton = (props: Props) => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const { structs } = useStructs()
  return (
    <>
      <PlusIcon
        size={20}
        className="text-foreground/60"
        onClick={(e) => {
          e.stopPropagation()
          impact()
          setOpen(true)
        }}
      />

      <Drawer open={open} setOpen={setOpen} isFullHeight>
        <DrawerHeader
          showCancelButton
          onConfirm={async () => {
            const struct = structs.find((s) => s.isTask)!
            const column = struct.columns.find((c) => c.slug === 'list')!
            store.structs.addOption(struct, column.id, { name })
            setOpen(false)
            setName('')
          }}
        >
          <DrawerTitle>
            <Trans>New list</Trans>
          </DrawerTitle>
        </DrawerHeader>
        <Input
          autoFocus
          className=""
          variant="filled"
          placeholder={t`List name`}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Drawer>
    </>
  )
}
