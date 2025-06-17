import React, { useEffect, useMemo, useRef, useState } from 'react'
import { MobileContent } from '@/components/MobileContent'
import { IonNavLink } from '@ionic/react'
import { Trans } from '@lingui/react/macro'
import { CreationCard } from '@penx/components/CreationCard/CreationCard'
import { useCreations } from '@penx/hooks/useCreations'
import { usePanels } from '@penx/hooks/usePanels'
import { useStructId } from '@penx/hooks/useStructId'
import { useStructs } from '@penx/hooks/useStructs'
import { PanelType, StructType } from '@penx/types'
import { cn } from '@penx/utils'
import { PageStructInfo } from '../PageStructInfo/PageStructInfo'
import { ImageList } from './ImageList'
import { ImageListContainer } from './ImageListContainer'

export const PageStruct: React.FC = ({ nav }: any) => {
  return <Content></Content>
}

function Content() {
  const { creations } = useCreations()
  const { structId } = useStructId()

  const { panels } = usePanels()
  const { structs } = useStructs()
  const struct = useMemo(() => {
    const structPanels = panels.find((p) => p.type === PanelType.STRUCT)
    const struct = structs.find((s) => s.id === structPanels?.structId)
    return struct
  }, [panels, structs])

  const filterCreations = creations.filter((c) => c.structId === structId)

  const content = useMemo(() => {
    return (
      <div>
        {filterCreations.map((creation) => {
          return <CreationCard key={creation.id} creation={creation} />
        })}
      </div>
    )
  }, [creations, structId])

  if (struct?.type == StructType.IMAGE) {
    return (
      <ImageListContainer
        title={struct?.name}
        rightSlot={
          <IonNavLink
            routerDirection="forward"
            component={() => <PageStructInfo struct={struct!} />}
          >
            <div className="text-brand mr-2 flex h-8 items-center">
              <Trans>Edit props</Trans>
            </div>
          </IonNavLink>
        }
      >
        {({ containerWidth }) => (
          <ImageList
            containerWidth={containerWidth}
            creations={filterCreations}
          />
        )}
      </ImageListContainer>
    )
  }

  return (
    <MobileContent
      backgroundColor="#f6f6f6"
      title={struct?.name}
      rightSlot={
        <IonNavLink
          routerDirection="forward"
          component={() => <PageStructInfo struct={struct!} />}
        >
          <div className="text-brand mr-2 flex h-8 items-center">
            <Trans>Edit props</Trans>
          </div>
        </IonNavLink>
      }
    >
      {content}
    </MobileContent>
  )
}
