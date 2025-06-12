import React, { useMemo } from 'react'
import { isAndroid } from '@/lib/utils'
import { Capacitor } from '@capacitor/core'
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonNavLink,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { CreationCard } from '@penx/components/CreationCard/CreationCard'
import { isMobileApp, WidgetType } from '@penx/constants'
import { useArea } from '@penx/hooks/useArea'
import { useCreations } from '@penx/hooks/useCreations'
import { useJournalLayout } from '@penx/hooks/useJournalLayout'
import { useStructs } from '@penx/hooks/useStructs'
import { Widget } from '@penx/types'
import { cn, mappedByKey } from '@penx/utils'
import { WidgetName } from '@penx/widgets/WidgetName'

export function PageWidget({ widget }: { widget: Widget }) {
  return (
    <>
      <IonHeader
        className={isAndroid ? 'safe-area' : ''}
        style={{
          boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
        }}
      >
        <IonToolbar
          className="toolbar"
          style={{
            '--border-width': 0,
            // borderBottom: scrolled ? '1px solid #eeee' : 'none',
            // borderBottom: 'none',
            // border: 'none',
          }}
        >
          <IonButtons slot="start">
            <IonBackButton text=""></IonBackButton>
          </IonButtons>
          <IonTitle>
            <Title widget={widget} />
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen class="ion-padding content">
        <Content widget={widget} />
      </IonContent>
    </>
  )
}

function Title({ widget }: { widget: Widget }) {
  const { structs } = useStructs()
  return <WidgetName widget={widget} structs={structs} />
}

function Content({ widget }: { widget: Widget }) {
  const { creations } = useCreations()
  const { area } = useArea()
  const filteredCreations = useMemo(() => {
    if (widget.structId) {
      return creations.filter((c) => c.structId === widget.structId)
    }

    if (widget.type === WidgetType.RECENTLY_OPENED) {
      return [...creations]
        .sort((a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf())
        .slice(0, 50)
    }

    if (widget.type === WidgetType.FAVORITES) {
      const favorites = area.favorites || []
      const creationsMap = mappedByKey(creations, 'id')
      return favorites.map((id) => creationsMap[id])
    }

    return creations
  }, [widget, creations])

  const { isCard, isList } = useJournalLayout()

  return (
    <div
      className={cn(
        isCard ? 'columns-2 gap-x-2 align-top' : 'flex flex-col gap-4 ',
        // isMobileApp && !isCard && 'gap-6',
        isMobileApp && isList && 'gap-0',
      )}
    >
      {filteredCreations.map((creation) => {
        return (
          <CreationCard key={creation.id} creation={creation}></CreationCard>
        )
      })}
    </div>
  )
}
