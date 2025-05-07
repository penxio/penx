'use client'

import React from 'react'
import { useIonRouter } from '@ionic/react'
import { PlusIcon } from 'lucide-react'
import { appEmitter } from '@penx/emitter'
import { useAddCreation } from '@penx/hooks/useAddCreation'
import { creationIdAtom } from '@penx/hooks/useCreationId'
import { store } from '@penx/store'
import { CreationType } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { cn } from '@penx/utils'

interface Props {
  className?: string
}

export function MobileAddCreationButton({ className }: Props) {
  const addCreation = useAddCreation()
  return (
    <Button
      size="icon"
      className={cn('size-12 shadow-xl', className)}
      onClick={async () => {
        const creation = await addCreation(CreationType.PAGE)
        store.set(creationIdAtom, creation.id)
      }}
    >
      <PlusIcon size={24} className="" />
    </Button>
  )
}
