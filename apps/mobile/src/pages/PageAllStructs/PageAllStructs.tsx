import React, { useState } from 'react'
import { MobileContent } from '@/components/MobileContent'
import { Trans } from '@lingui/react/macro'
import { AllStructs } from '../PageHome/AllStructs/AllStructs'

interface Props {
  isStructManagement: boolean
}

export const PageAllStructs: React.FC = (props: Props) => {
  return <Content {...props}></Content>
}

function Content(props: Props) {
  return (
    <MobileContent title={<Trans>Structs</Trans>}>
      <AllStructs {...props} />
    </MobileContent>
  )
}
