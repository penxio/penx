import React from 'react'
import { IonFab } from '@ionic/react'
import { WidgetType } from '@penx/constants'
import { useWidget } from '@penx/hooks/useWidget'
import { cn } from '@penx/utils'
import { AddMoreButton } from './AddMoreButton'
import { AddNoteButton } from './AddNoteButton'
import { VoiceRecorderButton } from './VoiceRecorderButton'

interface Props {
  open: boolean
  onAdd: () => void
}

export const HomeFooter = ({ open, onAdd }: Props) => {
  const { widget } = useWidget()

  if (widget && widget?.type !== WidgetType.JOURNAL) return null
  return (
    <IonFab
      slot="fixed"
      vertical="bottom"
      horizontal="center"
      className="flex w-full flex-col"
    >
      {/* <IonFabButton></IonFabButton> */}

      <div
        className={cn('relative inline-flex items-center justify-center pb-6')}
      >
        <div className="shadow-popover bg-background dark:bg-brand text-foreground relative inline-flex h-[52px] items-center gap-2 rounded-full px-2">
          <VoiceRecorderButton />
          <AddNoteButton onAdd={onAdd} />
          <AddMoreButton />
        </div>
      </div>
    </IonFab>
  )
}
