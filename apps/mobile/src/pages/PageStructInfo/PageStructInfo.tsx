import React from 'react'
import { WidgetList } from '@/components/EditWidget/WidgetList'
import { useTheme } from '@/components/theme-provider'
import { Capacitor } from '@capacitor/core'
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { Struct } from '@penx/domain'
import { useStructs } from '@penx/hooks/useStructs'
import { store } from '@penx/store'
import { Input } from '@penx/uikit/ui/input'
import { ColumnList } from './ColumnList'
import { EditPropertyDrawer } from './EditPropertyDrawer/EditPropertyDrawer'
import { OptionDrawer } from './EditPropertyDrawer/OptionDrawer'

const platform = Capacitor.getPlatform()

export function PageStructInfo({ struct }: { struct: Struct }) {
  return (
    <>
      <IonHeader
        className={platform === 'android' ? 'safe-area' : ''}
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
        <div id="portal" className="fixed left-0 top-0 z-[1000]" />
        <Content structId={struct.id} />
      </IonContent>
    </>
  )
}

function Content({ structId }: { structId: string }) {
  const { theme, isDark } = useTheme()
  const { structs } = useStructs()
  const struct = structs.find((s) => s.id === structId)!

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Input
          size="lg"
          defaultValue={struct.name}
          variant="mobile"
          placeholder={t`Struct name`}
          onChange={(e) => {
            if (e.target.value.trim() !== '') {
              store.structs.updateStructProps(struct, {
                name: e.target.value.trim(),
              })
            }
          }}
        />
      </div>
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
