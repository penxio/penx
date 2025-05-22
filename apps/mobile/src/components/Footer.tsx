import React from 'react'
import { useHomeTab } from '@/hooks/useHomeTab'
import { Capacitor } from '@capacitor/core'
import { IonFab, IonFabButton, IonFooter, IonToolbar } from '@ionic/react'
import { PlusIcon } from 'lucide-react'
import { Button } from '@penx/uikit/button'
import { cn } from '@penx/utils'

const platform = Capacitor.getPlatform()

interface Props {
  open: boolean
  onAdd: () => void
}

export const Footer = ({ open, onAdd }: Props) => {
  if (open) return null
  return (
    <IonFab
      slot="fixed"
      vertical="bottom"
      horizontal="center"
      className="flex w-full flex-col"
    >
      {/* <IonFabButton></IonFabButton> */}

      <div
        className={cn(
          'flex items-center justify-center gap-3 pb-2',
          platform === 'android' && 'pb-4',
        )}
      >
        <Button
          size="icon"
          variant="ghost"
          className="text-background shadow-popover dark:bg-brand size-14 rounded-full bg-white"
          onClick={async () => {
            onAdd()
          }}
        >
          <PlusIcon size={28} className="text-foreground" />
        </Button>
      </div>
    </IonFab>
  )
}
