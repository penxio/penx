import React, { useEffect, useMemo, useRef, useState } from 'react'
import { MobileContent } from '@/components/MobileContent'
import { StructHeader } from '@/components/StructHeader'
import { mainBackgroundLight } from '@/lib/constants'
import { DarkMode } from '@aparajita/capacitor-dark-mode'
import { Capacitor } from '@capacitor/core'
import { IonNavLink } from '@ionic/react'
import { Trans } from '@lingui/react/macro'
import { useQuery } from '@tanstack/react-query'
import { CreationCard } from '@penx/components/CreationCard/CreationCard'
import { PanelList } from '@penx/components/DashboardLayout/PanelList'
import { useCreations } from '@penx/hooks/useCreations'
import { usePanels } from '@penx/hooks/usePanels'
import { useStructId } from '@penx/hooks/useStructId'
import { useStructs } from '@penx/hooks/useStructs'
import { PanelType } from '@penx/types'
import { cn } from '@penx/utils'
import { PageStructInfo } from './PageStructInfo/PageStructInfo'

export const PageStruct: React.FC = ({ nav }: any) => {
  return (
    <>
      <Content></Content>
    </>
  )
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

  return (
    <MobileContent
      title={struct?.name}
      backgroundColor="#f6f6f6"
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
      {creations.map((creation) => {
        if (creation.raw.props.structId !== structId) return null
        return <CreationCard key={creation.id} creation={creation} />
      })}
    </MobileContent>
  )
}
