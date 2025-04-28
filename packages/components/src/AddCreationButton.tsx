'use client'

import { Button } from '@penx/uikit/button'
import { useAddCreation } from '@penx/hooks/useAddCreation'
import { CreationType } from '@penx/types'
import { PlusIcon } from 'lucide-react'

interface Props {
  className?: string
}

export function AddCreationButton({ className }: Props) {
  const addCreation = useAddCreation()
  return (
    <Button
      variant="ghost"
      size="icon"
      className="hover:bg-foreground/10 size-8"
      onClick={() => {
        addCreation(CreationType.PAGE)
      }}
    >
      <PlusIcon size={20} className="" />
    </Button>
  )
}
