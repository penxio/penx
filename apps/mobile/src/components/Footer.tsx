import React from 'react'
import { useHomeTab } from '@/hooks/useHomeTab'
import { IonFooter, IonToolbar } from '@ionic/react'
import { PlusIcon } from 'lucide-react'
import { Button } from '@penx/uikit/button'
import { cn } from '@penx/utils'

interface Props {
  onAdd: () => void
}

export const Footer = ({ onAdd }: Props) => {
  const { setType } = useHomeTab()

  return (
    <IonFooter>
      <IonToolbar
        className="toolbar px-3"
        style={{
          '--border-width': 0,
        }}
      >
        <div className="bg-background flex items-center justify-between gap-3 rounded-full px-3 dark:bg-neutral-900">
          <Button
            size="icon"
            variant="ghost"
            className={cn('size-8 rounded-full')}
            onClick={async () => {
              setType('HOME')
            }}
          >
            <span className="icon-[solar--home-2-linear] size-6"></span>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className={cn('size-8 rounded-full')}
            onClick={async () => {
              setType('HOME')
            }}
          >
            <span className="icon-[solar--notes-linear] size-6"></span>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-background bg-foreground size-9 rounded-full"
            onClick={async () => {
              onAdd()
            }}
          >
            <PlusIcon size={24} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className={cn('size-8 rounded-full')}
            onClick={async () => {
              setType('TASK')
            }}
          >
            <span className="icon-[solar--check-square-linear] size-6"></span>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className={cn('size-8 rounded-full')}
            onClick={async () => {
              setType('TASK')
            }}
          >
            <span className="icon-[solar--user-linear] size-6"></span>
          </Button>
        </div>
      </IonToolbar>
    </IonFooter>
  )
}
