import React, { useEffect, useMemo, useRef, useState } from 'react'
import { MobileContent } from '@/components/MobileContent'
import { PageStructInfo } from '@/pages/PageStructInfo/PageStructInfo'
import { IonNavLink } from '@ionic/react'
import { Trans } from '@lingui/react/macro'
import { CreationCard } from '@penx/components/CreationCard/CreationCard'
import { useCreations } from '@penx/hooks/useCreations'
import { usePanels } from '@penx/hooks/usePanels'
import { useStructId } from '@penx/hooks/useStructId'
import { useStructs } from '@penx/hooks/useStructs'
import { PanelType, StructType } from '@penx/types'
import { cn } from '@penx/utils'
import { ImageList } from './ImageList'
import { ImageListContainer } from './ImageListContainer'

interface Props {
  structId: string
}

export function StructCreations({ structId }: Props) {
  const { creations } = useCreations()
  const { structs } = useStructs()
  const struct = structs.find((s) => s.id === structId)!
  const filterCreations = creations.filter((c) => c.structId === structId)

  if (struct?.type == StructType.IMAGE) {
    return (
      <ImageListContainer>
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
    <div className="flex flex-col gap-4">
      {filterCreations.map((creation) => {
        return (
          <CreationCard
            key={creation.id}
            showType={false}
            creation={creation}
          />
        )
      })}
    </div>
  )
}
