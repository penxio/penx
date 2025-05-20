import React from 'react'
import { useHomeTab } from '@/hooks/useHomeTab'
import { IonFooter, IonToolbar } from '@ionic/react'
import { PlusIcon } from 'lucide-react'
import { Button } from '@penx/uikit/button'

interface Props {
  onAdd: () => void
}

export const Footer = ({ onAdd }: Props) => {
  const { setType } = useHomeTab()

  return (
    <IonFooter
      style={{
        boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
      }}
    >
      <IonToolbar
        className="toolbar px-3"
        style={{
          '--border-width': 0,
        }}
      >
        <div className="flex items-center justify-center gap-3 rounded-full px-3 pb-4">
          <Button
            size="icon"
            variant="ghost"
            className="text-background shadow-popover size-14 rounded-full"
            onClick={async () => {
              onAdd()
            }}
          >
            <PlusIcon size={28} className="text-foreground" />
          </Button>
        </div>
      </IonToolbar>
    </IonFooter>
  )
}
