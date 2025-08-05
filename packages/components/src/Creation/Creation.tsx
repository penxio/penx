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
import { CreationHeader } from './CreationHeader'
import { DeleteCreationDialog } from './DeleteCreationDialog/DeleteCreationDialog'
import { ImageCreationUpload } from './ImageCreationUpload'
import { usePanelCreationContext } from './PanelCreationProvider'
import { PropList } from './PropList/PropList'
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
          'creation-container relative z-0 flex-1 flex-col overflow-y-auto overflow-x-hidden px-3 pb-40 pt-14 outline-none md:px-8',
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
          <CreationHeader />

          <PropList
            className="text-sm"
            struct={struct!}
            creation={creation}
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
                updateCreationProps(creation.id, {
                  data: {
                    ...creation.data,
                    url: url,
                  },
                })
              }}
            />
          )}
        </div>
        <div className={cn('mx-auto w-full max-w-2xl px-0 mt-4')}>
          <NovelEditor
            className=""
            value={creation.content ? creation.content : defaultEditorContent}
            onChange={(v: any) => {
              const input = {
                content: v,
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
