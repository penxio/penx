import { useState } from 'react'
import { ColorSelector } from '@/components/ColorSelector'
import { Card } from '@/components/ui/Card'
import { Drawer } from '@/components/ui/Drawer'
import { DrawerHeader } from '@/components/ui/DrawerHeader'
import { DrawerTitle } from '@/components/ui/DrawerTitle'
import { MobileInput } from '@/components/ui/MobileInput'
import { impact } from '@/lib/impact'
import { lighten, opacify, transparentize } from '@fower/color-helper'
import { IonNavLink } from '@ionic/react'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { PlusIcon } from 'lucide-react'
import { Struct } from '@penx/domain'
import { useStructs } from '@penx/hooks/useStructs'
import {
  colorNameMaps,
  getBgColor,
  getBgColorDark,
} from '@penx/libs/color-helper'
import { store } from '@penx/store'
import { Avatar, AvatarFallback } from '@penx/uikit/ui/avatar'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'
import { StructIcon } from '@penx/widgets/StructIcon'
import { EmojiPicker } from '../PageStructInfo/EmojiPicker'
import { PageStructInfo } from '../PageStructInfo/PageStructInfo'

interface Props {}

export function CreateStructButton({}: Props) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [color, setColor] = useState('')
  const [emoji, setEmoji] = useState('')
  function resetForm() {
    setName('')
    setColor('')
    setEmoji('')
  }
  return (
    <>
      <Button
        className="flex w-full items-center gap-2"
        size="xl"
        onClick={() => {
          impact()
          setOpen(true)
        }}
      >
        <PlusIcon />
        <span>
          <Trans>Create struct</Trans>
        </span>
      </Button>
      <Drawer isFullHeight open={open} setOpen={setOpen} className="">
        <DrawerHeader
          showCancelButton
          disabled={!name || !color || !emoji}
          onCancel={() => {
            resetForm()
          }}
          onConfirm={() => {
            if (!name || !color || !emoji) return null
            impact()
            store.structs.createStruct({
              name,
              color,
              emoji,
            })
            resetForm()
          }}
        >
          <DrawerTitle>
            <Trans>Create struct</Trans>
          </DrawerTitle>
        </DrawerHeader>

        <div className="mb-8 flex justify-center">
          <EmojiPicker
            color={color}
            value={emoji}
            onChange={(v) => {
              setEmoji(v)
            }}
          />
        </div>
        <Card className="">
          <MobileInput
            label={<Trans>Name</Trans>}
            placeholder={t`Struct name`}
            defaultValue={name}
            onChange={(e) => {
              setName(e.target.value)
            }}
          />
          <ColorSelector
            value={color}
            onChange={(color) => {
              setColor(color)
            }}
          />
        </Card>
      </Drawer>
    </>
  )
}
