'use client'

import React, { useRef } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useKeyboard } from '@/hooks/useKeyboard'
import { useQuery } from '@tanstack/react-query'
import { Creation } from '@penx/components/Creation'
import { AudioCreationUpload } from '@penx/components/Creation/AudioCreationUpload'
import { CreationHeader } from '@penx/components/Creation/CreationHeader'
import { ImageCreationUpload } from '@penx/components/Creation/ImageCreationUpload'
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
import { cn } from '@penx/utils'
import { FixedToolbar } from './FixedToolbar'
import { KeyboardPadding } from './KeyboardPadding'
import { MobilePropList } from './MobilePropList/MobilePropList'

interface Props {
  // creation: ICreation;
  creationId: string
}

export function MobileCreation({ creationId }: Props) {
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
              <CreationHeader />
              <MobilePropList
                onUpdateProps={(newCells) => {
                  updateCreationProps(creation.id, { cells: newCells })
                }}
              />

              {struct?.type === StructType.AUDIO && (
                <div className="mt-6">
                  <AudioCreationUpload creation={creation as any} />
                </div>
              )}

              {isImage && (
                <ImageCreationUpload
                  creation={creation}
                  onFileChange={(file) => {
                    const title = file.name
                    updateCreationProps(creation.id, { title })
                  }}
                  onUploaded={async (url) => {
                    console.log('uploaded===url===>>>>:', url)

                    const newC = await updateCreationProps(creation.id, {
                      data: {
                        ...creation.data,
                        url: url,
                      },
                    })
                    console.log('====newC:', newC)
                  }}
                />
              )}
            </div>
            <div className={cn('mx-auto w-full max-w-2xl px-0')}>
              <NovelEditor
                className=""
                value={
                  creation.content
                    ? JSON.parse(creation.content)
                    : defaultEditorContent
                }
                onChange={(v: any[]) => {
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
              >
                <FixedToolbar />
                <KeyboardPadding></KeyboardPadding>
              </NovelEditor>
            </div>
          </div>
        </ErrorBoundary>
      </div>
    </>
  )
}
