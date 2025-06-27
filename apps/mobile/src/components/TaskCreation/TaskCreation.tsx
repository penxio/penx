'use client'

import React, { useRef } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useKeyboard } from '@/hooks/useKeyboard'
import { AlarmClockIcon, FlagIcon, ListTreeIcon } from 'lucide-react'
import { CreationHeader } from '@penx/components/Creation/CreationHeader'
import { ImageCreationUpload } from '@penx/components/Creation/ImageCreationUpload'
import { PropList } from '@penx/components/Creation/PropList/PropList'
import { fallbackRender } from '@penx/components/Fallback/Fallback'
import {
  PanelCreationProvider,
  usePanelCreationContext,
} from '@penx/components/PanelCreationProvider'
import { PublishDialog } from '@penx/components/PublishDialog'
import { defaultEditorContent, isMobileApp } from '@penx/constants'
import { appEmitter } from '@penx/emitter'
import { updateCreationProps } from '@penx/hooks/useCreation'
import { useStructs } from '@penx/hooks/useStructs'
import { ICreationNode } from '@penx/model-type'
import { NovelEditor } from '@penx/novel-editor/components/novel-editor'
import { StructType } from '@penx/types'
import { Button } from '@penx/uikit/ui/button'
import { Separator } from '@penx/uikit/ui/separator'
import { cn } from '@penx/utils'
import { ChangeType } from '../ChangeType'
import { MobileCreationEditor } from '../MobileCreationEditor'
import { MobilePropList } from '../MobilePropList/MobilePropList'
import { MobileTags } from '../MobileTags/MobileTags'
import { Priority } from './Priority'
import { Reminder } from './Reminder'

interface Props {}

export function TaskCreation({}: Props) {
  const { height } = useKeyboard()
  const creation = usePanelCreationContext()
  const isImage = creation.type === StructType.IMAGE
  const { structs } = useStructs()
  const struct = structs.find((m) => m.id === creation.structId)
  return (
    <>
      <PublishDialog />
      <div className="flex min-h-full flex-col">
        <ErrorBoundary fallbackRender={fallbackRender}>
          <div
            className={cn(
              'creation-container relative z-0 flex-1 flex-col overflow-y-auto overflow-x-hidden pb-40',
            )}
            onClick={(e: any) => {
              if (e.target?.className?.includes?.('creation-container')) {
                appEmitter.emit('FOCUS_EDITOR')
              }
            }}
          >
            <div className={cn('relative mx-auto w-full max-w-2xl px-0')}>
              <CreationHeader canChangeType={false} />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <ChangeType creation={creation} />
                  <div className="text-foreground/60 text-lg">•</div>
                  <MobileTags creation={creation} />
                </div>

                <div className="text-foreground/40 mt-auto flex items-center justify-end gap-4">
                  {/* <Trash2Icon size={18} /> */}
                  {/* <ListTreeIcon size={20} /> */}
                  {/* <TimerIcon /> */}
                  <Reminder struct={struct!} creation={creation} />
                  <Priority struct={struct!} creation={creation} />
                </div>
                {/* <Separator className="bg-foreground/5 mt-1 h-0.5 w-full" /> */}
              </div>
            </div>

            <div className={cn('mx-auto w-full max-w-2xl px-0')}>
              <MobileCreationEditor
                value={
                  creation.content
                    ? JSON.parse(creation.content)
                    : defaultEditorContent
                }
                onChange={(v) => {
                  const input = {
                    content: JSON.stringify(v),
                  } as ICreationNode['props']

                  // if (creation.type === StructType.NOTE) {
                  //   const title = v
                  //     .map((n) => Node.string(n))
                  //     .join(', ')
                  //     .slice(0, 20)
                  //   input.title = title
                  // }

                  updateCreationProps(creation.id, input)
                }}
              />
            </div>
          </div>
        </ErrorBoundary>
      </div>
    </>
  )
}
