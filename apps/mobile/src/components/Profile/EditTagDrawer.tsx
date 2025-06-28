'use client'

import { useState } from 'react'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { CheckIcon, HashIcon, PlusIcon, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Creation, Tag } from '@penx/domain'
import { getColorByName, getTextColorByName } from '@penx/libs/color-helper'
import { localDB } from '@penx/local-db'
import { store } from '@penx/store'
import { Button } from '@penx/uikit/ui/button'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { ColorSelector } from '../ColorSelector'
import { Card } from '../ui/Card'
import { Drawer } from '../ui/Drawer'
import { DrawerHeader } from '../ui/DrawerHeader'
import { DrawerTitle } from '../ui/DrawerTitle'
import { MobileInput } from '../ui/MobileInput'

interface Props {
  tag: Tag
}

export function EditTagDrawer({ tag }: Props) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(tag.name)
  const [color, setColor] = useState(tag.color)
  const disabled = !name || !color

  async function handleEdiTag() {
    await localDB.updateTagProps(tag.id, {
      name,
      color,
    })
    await store.tags.refetchTags()
    setOpen(false)
  }

  return (
    <>
      <Button
        size="xs"
        onClick={() => {
          setOpen(true)
        }}
      >
        <Trans>Edit</Trans>
      </Button>
      <Drawer
        open={open}
        setOpen={setOpen}
        isFullHeight
        shouldScaleBackground={false}
      >
        <DrawerHeader
          // className="bg-white"
          showCancelButton
          disabled={disabled}
          onConfirm={() => {
            if (disabled) return
            handleEdiTag()
          }}
        >
          <DrawerTitle>
            <Trans>Edit Tag</Trans>
          </DrawerTitle>
        </DrawerHeader>
        <Card>
          <MobileInput
            placeholder={t`Tag name`}
            label={t`Name`}
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <ColorSelector
            value={color}
            onChange={(v) => {
              setColor(v)
            }}
          />
        </Card>
      </Drawer>
    </>
  )
}
