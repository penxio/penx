import React, { useState } from 'react'
import { MobileContent } from '@/components/MobileContent'
import { Trans } from '@lingui/react/macro'
import { CreateStructButton } from './CreateStructButton'
import { StructList } from './StructList'
import { StructMarketplace } from './StructMarketplace'
import { NavType, StructNav } from './StructNav'

interface Props {
  isStructManagement?: boolean
}

export function AllStructs({ isStructManagement = false }: Props) {
  const [navType, setNavType] = useState(NavType.MY_STRUCT)

  if (isStructManagement) {
    return (
      <div className="flex flex-col gap-4">
        <CreateStructButton />
        <StructList isStructManagement={isStructManagement} />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <StructNav navType={navType} onSelect={(v) => setNavType(v)} />
      {navType === NavType.MY_STRUCT && (
        <div className="flex flex-col gap-4">
          <CreateStructButton />
          <StructList />
        </div>
      )}
      {navType === NavType.MARKETPLACE && <StructMarketplace />}
    </div>
  )
}
