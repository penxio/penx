import React, { useState } from 'react'
import { MobileContent } from '@/components/MobileContent'
import { Trans } from '@lingui/react/macro'
import { AllStructs } from '../PageHome/AllStructs/AllStructs'

export const PageAllStructs: React.FC = ({ nav }: any) => {
  return <Content></Content>
}

function Content() {
  return (
    <MobileContent title={<Trans>Structs</Trans>}>
      <AllStructs />
    </MobileContent>
  )
}
