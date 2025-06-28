'use client'

import React, { memo, useState } from 'react'
import { format } from 'date-fns'
import { ContentRender } from '@penx/content-render'
import { Creation } from '@penx/domain'
import { useCreations } from '@penx/hooks/useCreations'
import { store } from '@penx/store'
import { PanelType } from '@penx/types'
import { docToString } from '@penx/utils/editorHelper'
import { Tags } from './CreationItem/Tags'
import { CustomMasonry } from './CustomMasonry'

interface Props {
  height: number
  width: number
}

export const PanelNotes = (props: Props) => {
  const { creations } = useCreations()
  const notes = creations.filter((c) => c.isNote)
  return (
    <CustomMasonry
      className="p-4"
      items={notes}
      render={NoteCard}
      overscanBy={10}
      width={Number(props.width)}
      height={Number(props.height)}
    />
  )
}

interface ItemProps {
  index: number
  data: Creation
  width: number
}
const NoteCard = memo(({ index, data: creation, width }: ItemProps) => {
  return (
    <div
      className="shadow-card bg-background cursor-pointer rounded-xl p-3 text-base"
      onClick={() => {
        store.panels.updateMainPanel({
          type: PanelType.CREATION,
          creationId: creation.id,
        })
      }}
    >
      <div className="break-words">
        {docToString(JSON.parse(creation.content))}
      </div>
      {/* <ContentRender
        className="px-0 text-sm"
        content={JSON.parse(creation.content)}
      /> */}

      <div className="flex items-center gap-2">
        <div className="text-foreground/50 text-[10px]">
          {format(creation.createdAt, 'HH:mm')}
        </div>
        <Tags creation={creation} />
      </div>
    </div>
  )
})
