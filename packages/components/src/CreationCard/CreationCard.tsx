'use client'

import { useMemo } from 'react'
import { isMobileApp } from '@penx/constants'
import { Creation } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
import { updateCreationProps } from '@penx/hooks/useCreation'
import { useCreationStruct } from '@penx/hooks/useCreationStruct'
import { getBgColor, getTextColorByName } from '@penx/libs/color-helper'
import { store } from '@penx/store'
import { PanelType } from '@penx/types'
import { Checkbox } from '@penx/uikit/checkbox'
import { uniqueId } from '@penx/unique-id'
import { cn } from '@penx/utils'
import { generateGradient } from '@penx/utils/generateGradient'
import { Link } from './Link'
import { Tags } from './Tags'
import { VoiceContent } from './VoiceContent'

interface Props {
  creation: Creation
}

export function CreationCard({ creation }: Props) {
  const struct = useCreationStruct(creation)

  const content = useMemo(() => {
    if (creation.isVoice) {
      return <VoiceContent recording={JSON.parse(creation.content)} />
    }
    return (
      <>
        {!creation.isNote && (
          <div className="flex items-center gap-2">
            {creation.isTask && (
              <Checkbox
                onClick={(e) => e.stopPropagation()}
                defaultChecked={creation.checked}
                onCheckedChange={(v) => {
                  updateCreationProps(creation.id, {
                    checked: v as any,
                  })
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
        <Tags creation={creation} />
      </>
    )
  }, [creation])

  if (!struct) return null
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {/* <div
          className={cn('size-4 rounded-sm', generateGradient(struct.name))}
        ></div> */}

        {/* <div
          className={cn('size-2 rounded-full', getBgColor(struct.color))}
        ></div> */}

        <div className={cn('from-accent-foreground text-xs font-medium')}>
          {struct.name}
        </div>

        <div>
          <div className="text-foreground/50 text-[10px]">
            {creation.formattedTime}
          </div>
        </div>
      </div>
      <div>
        <div
          className="shadow-card inline-flex flex-col rounded-xl bg-white px-4 py-3 dark:bg-neutral-700"
          onClick={() => {
            if (isMobileApp) {
              if (creation.isVoice) return
              return appEmitter.emit('ROUTE_TO_CREATION', creation)
            }
            store.panels.updateMainPanel({
              id: uniqueId(),
              type: PanelType.CREATION,
              creationId: creation.id,
            })
          }}
        >
          {content}
        </div>
      </div>
    </div>
  )
}
