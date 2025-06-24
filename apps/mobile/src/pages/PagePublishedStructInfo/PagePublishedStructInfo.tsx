import React from 'react'
import { ColorSelector } from '@/components/ColorSelector'
import { MobileContent } from '@/components/MobileContent'
import { Card } from '@/components/ui/Card'
import { MobileInput } from '@/components/ui/MobileInput'
import { mainBackgroundLight } from '@/lib/constants'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { Struct } from '@penx/domain'
import { useStructs } from '@penx/hooks/useStructs'
import { isBuiltinStruct } from '@penx/libs/isBuiltinStruct'
import { store } from '@penx/store'
import { StructType } from '@penx/types'
import { Textarea } from '@penx/uikit/ui/textarea'
import { ColumnList } from './ColumnList'
import { EditPropertyDrawer } from './EditPropertyDrawer/EditPropertyDrawer'
import { OptionDrawer } from './EditPropertyDrawer/OptionDrawer'
import { EmojiPicker } from './EmojiPicker'
import { StructInfoFooter } from './StructInfoFooter/StructInfoFooter'

export function PagePublishedStructInfo({ struct }: { struct: Struct }) {
  return (
    <MobileContent
      backgroundColor={mainBackgroundLight}
      title={<div className="text-foreground">{struct.name}</div>}
    >
      <Content struct={struct} />
    </MobileContent>
  )
}

function Content({ struct }: { struct: Struct }) {
  if (!struct) return null

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-center">
        <EmojiPicker
          readonly
          color={struct.color}
          value={struct.emoji}
          onChange={(v) => {
            store.structs.updateStructProps(struct, {
              emoji: v,
            })
          }}
        />
      </div>
      <Card className="">
        <MobileInput
          readOnly
          label={<Trans>Name</Trans>}
          placeholder={t`Struct name`}
          defaultValue={struct.name}
          onChange={(e) => {
            if (e.target.value.trim() !== '') {
              store.structs.updateStructProps(struct, {
                name: e.target.value.trim(),
              })
            }
          }}
        />
        <ColorSelector
          readOnly
          value={struct.color}
          onChange={(color) => {
            store.structs.updateStructProps(struct, {
              color,
            })
          }}
        />
      </Card>

      <Card>
        <Textarea
          readOnly
          className="text-foreground border-none bg-white text-base shadow-none focus-visible:border-none focus-visible:ring-0 dark:bg-neutral-700/60"
          placeholder={t`Introduction`}
          defaultValue={struct.description}
          onChange={(e) => {
            store.structs.updateStructProps(struct, {
              description: e.target.value.trim(),
            })
          }}
        ></Textarea>
      </Card>
      <div className="space-y-2">
        <div className="text-foreground/60 text-sm">
          <Trans>Properties</Trans>
        </div>
        <ColumnList struct={struct} />
      </div>
    </div>
  )
}
