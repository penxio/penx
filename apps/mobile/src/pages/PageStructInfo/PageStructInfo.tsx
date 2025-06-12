import React from 'react'
import { ColorSelector } from '@/components/ColorSelector'
import { Card } from '@/components/ui/Card'
import { MobileInput } from '@/components/ui/MobileInput'
import { isAndroid } from '@/lib/utils'
import { Capacitor } from '@capacitor/core'
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
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

export function PageStructInfo({ struct }: { struct: Struct }) {
  return (
    <>
      <IonHeader
        className={isAndroid ? 'safe-area' : ''}
        style={{
          boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
        }}
      >
        <IonToolbar
          className="toolbar text-foreground"
          style={{
            '--border-width': 0,
          }}
        >
          <IonButtons slot="start">
            <IonBackButton text=""></IonBackButton>
          </IonButtons>
          <IonTitle>
            <div className="text-foreground">{struct.name}</div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen class="content ion-padding text-foreground">
        <Content structId={struct.id} />
      </IonContent>
      {!isBuiltinStruct(struct.type) && (
        <StructInfoFooter structId={struct.id} />
      )}
    </>
  )
}

function Content({ structId }: { structId: string }) {
  const { structs } = useStructs()
  const struct = structs.find((s) => s.id === structId)!

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-center">
        <EmojiPicker
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
          className="border-none bg-white text-base shadow-none focus-visible:border-none focus-visible:ring-0 dark:bg-neutral-700/60"
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
        <EditPropertyDrawer struct={struct} />
        <OptionDrawer struct={struct} />
      </div>
    </div>
  )
}
