'use client'

import { isMobileApp } from '@penx/constants'
import { Creation } from '@penx/domain'
import { useCreationStruct } from '@penx/hooks/useCreationStruct'
import { getTextColorByName } from '@penx/libs/color-helper'
import { store } from '@penx/store'
import { PanelType } from '@penx/types'
import { Checkbox } from '@penx/uikit/checkbox'
import { uniqueId } from '@penx/unique-id'
import { cn } from '@penx/utils'
import { Link } from './Link'

interface Props {
  creation: Creation
}

export function CreationCard({ creation }: Props) {
  const struct = useCreationStruct(creation)

  return (
    <div
      className={cn(
        'bg-background/90 shadow-xs flex cursor-pointer flex-col gap-2 rounded-lg p-4 transition-all hover:scale-105 hover:shadow-2xl',
        // isMobileApp && 'bg-foreground text-background',
      )}
      onClick={() => {
        if (isMobileApp) return
        store.panels.updateMainPanel({
          id: uniqueId(),
          type: PanelType.CREATION,
          creationId: creation.id,
        })
      }}
    >
      <div className="flex items-center justify-between">
        <div className={cn('text-xs', getTextColorByName(struct.color))}>
          {struct.name}
        </div>
        <div>
          <div className="text-foreground/50 text-xs">
            {creation.formattedTime}
          </div>
        </div>
      </div>
      {!creation.isNote && (
        <div className="flex items-center gap-2">
          {creation.isTask && (
            <Checkbox
              defaultChecked={creation.checked}
              onCheckedChange={(v) => {
                // updateCreationProps(creation.id, {
                //   checked: v as any,
                // })
              }}
            />
          )}

          <div
            className={cn(
              '',
              !creation.isNote && !creation.isTask && 'font-bold',
            )}
          >
            {creation.title || 'untitled'}
          </div>
        </div>
      )}
      {creation.isBookmark && <Link creation={creation} struct={struct} />}
      {creation.previewedContent && (
        <div className="line-clamp-2">{creation.previewedContent}</div>
      )}
      {/* <div className="text-foreground/50 flex items-center gap-2">
        {creation.isTask && (
          <div>
            <div>Todo</div>
          </div>
        )}
        <TagIcon className="size-4" />
      </div> */}
    </div>
  )
}
