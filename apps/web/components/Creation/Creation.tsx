'use client'

import { useMemo } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { usePanelCreationContext } from '@/components/Creation'
import { updateCreationById } from '@/hooks/useAreaCreations'
import {
  addCreationTag,
  CreationTagWithTag,
  Creation as IPost,
  removeCreationTag,
  updateCreation,
} from '@/hooks/useCreation'
import { usePostSaving } from '@/hooks/usePostSaving'
import { editorDefaultValue } from '@penx/constants'
import { UpdateCreationInput } from '@penx/constants'
import { useSearchParams } from 'next/navigation'
import { Node } from 'slate'
import { useDebouncedCallback } from 'use-debounce'
import { trpc } from '@penx/trpc-client'
import { CreationType } from '@penx/types'
import { PlateEditor } from '@penx/uikit/editor/plate-editor'
import { Checkbox } from '@penx/uikit/ui/checkbox'
import { Separator } from '@penx/uikit/ui/separator'
import { AddPropButton } from './AddPropButton'
import { AudioCreationUpload } from './AudioCreationUpload'
import { Authors } from './Authors'
import { ChangeType } from './ChangeType'
import { CoverUpload } from './CoverUpload'
import { DeletePostDialog } from './DeletePostDialog/DeletePostDialog'
import { ImageCreationUpload } from './ImageCreationUpload'
import { JournalNav } from './JournalNav'
import { PropList } from './PropList'
import { Tags } from './Tags'

export function Creation({ index }: { index: number }) {
  const { mutateAsync } = trpc.creation.update.useMutation()
  const { setPostSaving } = usePostSaving()
  const creation = usePanelCreationContext()

  const isImage = creation.type === CreationType.IMAGE

  const debouncedUpdate = useDebouncedCallback(
    async (value: IPost) => {
      setPostSaving(true)
      try {
        await mutateAsync({
          id: value.id,
          title: value.title,
          content: value.content,
          description: value.description,
          i18n: value.i18n ?? {},
          props: value?.props ?? {},
        })
      } catch (error) {}
      setPostSaving(false)
    },
    // delay in ms
    200,
  )

  const showTitle = useMemo(() => {
    if (
      creation.mold?.type === CreationType.ARTICLE ||
      creation.mold?.type === CreationType.PAGE ||
      creation.mold?.type === CreationType.BOOKMARK ||
      creation.mold?.type === CreationType.FRIEND ||
      creation.mold?.type === CreationType.PROJECT ||
      creation.mold?.type === CreationType.IMAGE ||
      creation.mold?.type === CreationType.TASK ||
      creation.mold?.type === CreationType.AUDIO
    ) {
      return true
    }
    return false
  }, [creation])

  const isCover = useMemo(() => {
    if (creation.mold?.type === CreationType.BOOKMARK) {
      return false
    }
    return true
  }, [creation])

  // console.log('=========>>>>>>post:', post)

  return (
    <>
      <DeletePostDialog />
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
                    {creation.mold?.type === CreationType.TASK && (
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
                  <Tags
                    creation={creation}
                    onDeleteCreationTag={(postTag: CreationTagWithTag) => {
                      removeCreationTag(postTag)
                    }}
                    onAddCreationTag={(postTag: CreationTagWithTag) => {
                      addCreationTag(postTag)
                    }}
                  />
                  {/* <PostLocales /> */}
                </div>
              </div>
            </div>

            <PropList
              onUpdateProps={(newPost) => {
                debouncedUpdate(newPost)
              }}
            />

            {creation?.mold?.type === CreationType.AUDIO && (
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
                className="dark:caret-brand w-full"
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
