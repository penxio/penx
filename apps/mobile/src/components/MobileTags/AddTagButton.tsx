'use client'

import { useState } from 'react'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { CheckIcon, HashIcon, PlusIcon, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import { isMobileApp } from '@penx/constants'
import { Creation } from '@penx/domain'
import {
  addCreationTag,
  createTag,
  deleteCreationTag,
} from '@penx/hooks/useCreation'
import { useCreationTags } from '@penx/hooks/useCreationTags'
import { useTags } from '@penx/hooks/useTags'
import { getColorByName, getTextColorByName } from '@penx/libs/color-helper'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { ColorSelector } from '../ColorSelector'
import { Card } from '../ui/Card'
import { Drawer } from '../ui/Drawer'
import { DrawerHeader } from '../ui/DrawerHeader'
import { DrawerTitle } from '../ui/DrawerTitle'
import { MobileInput } from '../ui/MobileInput'

interface Props {
  creation: Creation
}

export function AddTagButton({ creation }: Props) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [color, setColor] = useState('')
  const disabled = !name || !color

  async function handleCreateTag() {
    await createTag(creation, name)
    setOpen(false)
  }

  return (
    <>
      <PlusIcon
        className="text-foreground/60"
        onClick={() => {
          setOpen(true)
        }}
      />
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
            handleCreateTag()
          }}
        >
          <DrawerTitle>
            <Trans>Create Tag</Trans>
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
