'use client'

import { useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import TextareaAutosize from 'react-textarea-autosize'
import { useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
// import { usePanelCreationContext } from '@penx/components/Creation'
import {
  defaultEditorContent,
  isMobileApp,
  UpdateCreationInput,
} from '@penx/constants'
import { Creation as CreationDomain } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
import { updateCreationProps } from '@penx/hooks/useCreation'
import { usePostSaving } from '@penx/hooks/usePostSaving'
import { useStructs } from '@penx/hooks/useStructs'
import { ICreationNode } from '@penx/model-type'
import { NovelEditor } from '@penx/novel-editor/NovelEditor'
import { store } from '@penx/store'
import { Panel, StructType } from '@penx/types'
import { Checkbox } from '@penx/uikit/checkbox'
import { Separator } from '@penx/uikit/separator'
import { cn } from '@penx/utils'
import { Fallback, fallbackRender } from '../Fallback/Fallback'
import { AddPropButton } from './AddPropButton'
import { AudioCreationUpload } from './AudioCreationUpload'
import { Authors } from './Authors'
import { ChangeType } from './ChangeType'
import { CoverUpload } from './CoverUpload'
import { DeleteCreationDialog } from './DeleteCreationDialog/DeleteCreationDialog'
import { ImageCreationUpload } from './ImageCreationUpload'
import { usePanelCreationContext } from './PanelCreationProvider'
import { PropList } from './PropList'
import { Tags } from './Tags'

interface Props {
  panel?: Panel
  className?: string
  ref?: any
  editorFooter?: React.ReactNode
}

export function Creation({ panel, className, ref, editorFooter }: Props) {
  // const { mutateAsync } = trpc.creation.update.useMutation()
  const { setPostSaving } = usePostSaving()
  const creation = usePanelCreationContext()
  const isImage = creation.type === StructType.IMAGE
  const { structs } = useStructs()

  const struct = structs.find((m) => m.id === creation.structId)

  const hideTitle = useMemo(() => {
    if (struct?.type === StructType.NOTE) {
      return true
    }
    return false
  }, [struct])

  const isCover = useMemo(() => {
    if (struct?.type === StructType.BOOKMARK) {
      return false
    }
    return true
  }, [struct])

  useEffect(() => {
    //
    // if (struct?.type === StructType.NOTE) {
    //   appEmitter.emit('FOCUS_EDITOR')
    // }
  }, [struct])

  // console.log('=========>>>>>>post:', post)

  return (
    <ErrorBoundary fallbackRender={fallbackRender}>
      <div
        className={cn(
          'creation-container relative z-0 flex-1 flex-col overflow-y-auto overflow-x-hidden px-3 pb-40 pt-14 md:px-8',
          isMobileApp && 'px-3 pt-0',
          className,
        )}
        onClick={(e: any) => {
          if (e.target?.className?.includes?.('creation-container')) {
            appEmitter.emit('FOCUS_EDITOR')
          }
        }}
      >
        <div className={cn('mx-auto w-full max-w-2xl px-0')}>
          {!hideTitle && (
            <div className="mb-2 flex flex-col space-y-3 md:mb-5">
              <div className="relative">
                {/* {!isImage && !isMobileApp && (
                  <CoverUpload
                    creation={creation}
                    isCover={isCover}
                    onCoverUpdated={async (uri) => {
                      updateCreationProps(creation.id, {
                        image: uri,
                      })
                    }}
                  />
                )} */}
                <div className="flex items-center gap-2">
                  {struct?.type === StructType.TASK && (
                    <Checkbox
                      className="bg-foreground/10 size-6 border-none"
                      checked={creation.checked}
                      onCheckedChange={(v) => {
                        updateCreationProps(creation.id, {
                          checked: v as any,
                        })
                      }}
                    />
                  )}

                  <TextareaAutosize
                    className="dark:placeholder-text-600 placeholder:text-foreground/40 w-full resize-none border-none bg-transparent px-0 text-3xl font-bold focus:outline-none focus:ring-0 md:text-4xl"
                    placeholder="Title"
                    defaultValue={creation.title || ''}
                    // autoFocus={!isMobileApp}
                    autoFocus
                    onChange={(e) => {
                      const title = e.target.value
                      updateCreationProps(creation.id, { title })
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        appEmitter.emit('FOCUS_EDITOR')
                        e.preventDefault()
                      }
                    }}
                  />
                </div>
              </div>

              {/* <TextareaAutosize
                  className="dark:placeholder-text-600 w-full resize-none border-none bg-transparent px-0 placeholder:text-stone-400 focus:outline-none focus:ring-0"
                  placeholder="Description"
                  defaultValue={creation.description}
                  onChange={(e) => {
                    updateCreation({
                      id: creation.id,
                      description: e.target.value,
                    })
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                    }
                  }}
                /> */}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <ChangeType creation={creation} />
              <div className="text-foreground/60 text-lg">•</div>
              <div className="flex items-center gap-2">
                <Tags creation={creation} />
                {/* <PostLocales /> */}
              </div>
            </div>
          </div>

          <PropList
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
                updateCreationProps(creation.id, { image: url })
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
            {editorFooter}
          </NovelEditor>
        </div>

        {/* {!isImage && (
          <div className="mt-4 w-full" data-registry="plate">
            <PlateEditor
              ref={editorRef}
              variant="post"
              className="h-auto w-full overflow-hidden break-all"
              dndProvider={false}
              value={
                creation.content
                  ? JSON.parse(creation.content)
                  : defaultEditorContent
              }
              showAddButton
              showFixedToolbar={false}
              // showFixedToolbar
              onChange={(v: any[]) => {
                const input = {
                  content: JSON.stringify(v),
                } as ICreationNode['props']

                if (creation.type === StructType.NOTE) {
                  const title = v
                    .map((n) => Node.string(n))
                    .join(', ')
                    .slice(0, 20)
                  input.title = title
                }

                updateCreationProps(creation.id, input)
              }}
            />
          </div>
        )} */}
      </div>
    </ErrorBoundary>
  )
}
