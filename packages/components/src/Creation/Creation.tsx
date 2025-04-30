'use client'

import { useMemo } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { useSearchParams } from 'next/navigation'
import { Node } from 'slate'
import { useDebouncedCallback } from 'use-debounce'
// import { usePanelCreationContext } from '@penx/components/Creation'
import { editorDefaultValue, UpdateCreationInput } from '@penx/constants'
import { PlateEditor } from '@penx/editor/plate-editor'
import {
  addCreationTag,
  CreationTagWithTag,
  // Creation as IPost,
  deleteCreationTag,
  updateCreation,
} from '@penx/hooks/useCreation'
import { updateCreationById } from '@penx/hooks/useCreations'
import { useMolds } from '@penx/hooks/useMolds'
import { usePostSaving } from '@penx/hooks/usePostSaving'
import { ICreation } from '@penx/model-type/ICreation'
import { trpc } from '@penx/trpc-client'
import { CreationType } from '@penx/types'
import { Checkbox } from '@penx/uikit/checkbox'
import { Separator } from '@penx/uikit/separator'
import { AddPropButton } from './AddPropButton'
import { AudioCreationUpload } from './AudioCreationUpload'
import { Authors } from './Authors'
import { ChangeType } from './ChangeType'
import { CoverUpload } from './CoverUpload'
import { DeleteCreationDialog } from './DeleteCreationDialog/DeleteCreationDialog'
import { ImageCreationUpload } from './ImageCreationUpload'
import { JournalNav } from './JournalNav'
import { usePanelCreationContext } from './PanelCreationProvider'
import { PropList } from './PropList'
import { Tags } from './Tags'

export function Creation({ index }: { index: number }) {
  const { mutateAsync } = trpc.creation.update.useMutation()
  const { setPostSaving } = usePostSaving()
  const creation = usePanelCreationContext()
  const isImage = creation.type === CreationType.IMAGE
  const { molds } = useMolds()

  const debouncedUpdate = useDebouncedCallback(
    async (value: ICreation) => {
      setPostSaving(true)
      try {
        await mutateAsync({
          id: value.id,
          title: value.title,
          content: value.content,
          description: value.description,
          // i18n: value.i18n ?? {},
          // props: value?.props ?? {},
        })
      } catch (error) {
        //
      }
      setPostSaving(false)
    },
    // delay in ms
    200,
  )

  const mold = molds.find((m) => m.id === creation.moldId)

  const showTitle = useMemo(() => {
    if (
      mold?.type === CreationType.ARTICLE ||
      mold?.type === CreationType.PAGE ||
      mold?.type === CreationType.BOOKMARK ||
      mold?.type === CreationType.FRIEND ||
      mold?.type === CreationType.PROJECT ||
      mold?.type === CreationType.IMAGE ||
      mold?.type === CreationType.TASK ||
      mold?.type === CreationType.AUDIO
    ) {
      return true
    }
    return false
  }, [mold])

  const isCover = useMemo(() => {
    if (mold?.type === CreationType.BOOKMARK) {
      return false
    }
    return true
  }, [mold])

  // console.log('=========>>>>>>post:', post)

  return (
    <>
      <DeleteCreationDialog />
      <div className="h-full w-full">
        <div className="relative z-0 min-h-[500px] px-8 py-12">
          <div className="w-full px-16 sm:px-[max(10px,calc(50%-350px))]">
            {showTitle && (
              <div className="mb-5 flex flex-col space-y-3">
                <div className="relative">
                  {!isImage && (
                    <CoverUpload
                      creation={creation}
                      isCover={isCover}
                      onCoverUpdated={async (uri) => {
                        updateCreation({
                          id: creation.id,
                          image: uri,
                        })
                      }}
                    />
                  )}
                  <div className="flex items-center gap-2">
                    {mold?.type === CreationType.TASK && (
                      <Checkbox
                        className="bg-foreground/10 size-6 border-none"
                        checked={creation.checked}
                        onCheckedChange={(v) => {
                          updateCreation({
                            id: creation.id,
                            checked: v as any,
                          })
                        }}
                      />
                    )}

                    <TextareaAutosize
                      className="dark:placeholder-text-600 placeholder:text-foreground/40 w-full resize-none border-none bg-transparent px-0 text-4xl font-bold focus:outline-none focus:ring-0"
                      placeholder="Title"
                      defaultValue={creation.title || ''}
                      autoFocus
                      onChange={(e) => {
                        const title = e.target.value
                        updateCreation({ id: creation.id, title })
                        updateCreationById(creation.areaId!, creation.id, {
                          title,
                        })
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                        }
                      }}
                    />
                  </div>
                </div>

                <TextareaAutosize
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
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ChangeType creation={creation} />
                <Separator orientation="vertical" className="h-3" />
                <div className="flex items-center gap-2">
                  <Tags creation={creation} />
                  {/* <PostLocales /> */}
                </div>
              </div>
            </div>

            <PropList
              onUpdateProps={(newCreation) => {
                debouncedUpdate(newCreation)
              }}
            />

            {mold?.type === CreationType.AUDIO && (
              <div className="mt-6">
                <AudioCreationUpload creation={creation as any} />
              </div>
            )}

            {isImage && (
              <ImageCreationUpload
                creation={creation}
                onFileChange={(file) => {
                  const title = file.name
                  updateCreation({ id: creation.id, title })
                  updateCreationById(creation.areaId!, creation.id, { title })
                }}
                onUploaded={async (url) => {
                  updateCreation({ id: creation.id, image: url })
                  updateCreationById(creation.areaId!, creation.id, {
                    image: url,
                  })
                }}
              />
            )}
          </div>

          {!isImage && (
            <div className="mt-4 w-full" data-registry="plate">
              <PlateEditor
                variant="post"
                className="dark:caret-brand w-full break-all"
                dndProvider={false}
                value={
                  creation.content
                    ? JSON.parse(creation.content)
                    : editorDefaultValue
                }
                showAddButton
                showFixedToolbar={false}
                onChange={(v: any[]) => {
                  const input: UpdateCreationInput = {
                    id: creation.id,
                    content: JSON.stringify(v),
                  }

                  if (creation.type === CreationType.NOTE) {
                    const title = v
                      .map((n) => Node.string(n))
                      .join(', ')
                      .slice(0, 20)
                    input.title = title
                    updateCreationById(creation.areaId!, creation.id, { title })
                  }

                  updateCreation(input)
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
