'use client'

import { PlusIcon } from 'lucide-react'
import { useAddCreation } from '@penx/hooks/useAddCreation'
import { CreationType } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { cn } from '@penx/utils'

interface Props {
  className?: string
}

export function AddCreationButton({ className }: Props) {
  const addCreation = useAddCreation()
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        'hover:bg-foreground/10 bg-background size-8 rounded-lg',
        className,
      )}
      onClick={() => {
        addCreation({ type: CreationType.PAGE })
      }}
    >
      <PlusIcon size={20} className="" />
    </Button>
  )
}
