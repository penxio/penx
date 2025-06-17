import React, { useEffect, useRef, useState } from 'react'
import { MobileContent } from '@/components/MobileContent'
import { Trans } from '@lingui/react/macro'
import { CreateStructButton } from './CreateStructButton'
import { StructList } from './StructList'
import { StructMarketplace } from './StructMarketplace'
import { NavType, StructNav } from './StructNav'

export const PageAllStructs: React.FC = ({ nav }: any) => {
  return <Content></Content>
}

function Content() {
  const [navType, setNavType] = useState(NavType.MY_STRUCT)

  return (
    <MobileContent title={<Trans>Structs</Trans>}>
      <StructNav navType={navType} onSelect={(v) => setNavType(v)} />
      {navType === NavType.MY_STRUCT && (
        <div className="flex flex-col gap-4">
          <CreateStructButton />
          <StructList />
        </div>
      )}
      {navType === NavType.MARKETPLACE && <StructMarketplace />}
    </MobileContent>
  )
}
