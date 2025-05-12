'use client'

import React from 'react'
import { Creation } from '@penx/components/Creation'
import { PanelCreationProvider } from '@penx/components/PanelCreationProvider'
import { PublishDialog } from '@penx/components/PublishDialog'

interface Props {
  // creation: ICreation;
  creationId: string
}

export function MobileCreation(props: Props) {
  return (
    <PanelCreationProvider creationId={props.creationId}>
      <Content {...props}></Content>
    </PanelCreationProvider>
  )
}

function Content({}: Props) {
  return (
    <>
      <PublishDialog />
      <Creation />
    </>
  )
}
