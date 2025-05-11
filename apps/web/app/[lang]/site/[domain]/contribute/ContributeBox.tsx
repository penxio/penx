'use client'

import { useState } from 'react'
import { TextareaAutosize } from '@udecode/plate-caption/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { editorDefaultValue } from '@penx/constants'
import { CreationStatus, Product } from '@penx/db/client'
import { PlateEditor } from '@penx/editor/plate-editor'
import { useSession } from '@penx/session'
import { api, trpc } from '@penx/trpc-client'
import { CreationType, Site } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'

interface Props {
  site: Site
  tiers: Product[]
}

export function ContributeBox({ site }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const { isPending, mutateAsync } = trpc.creation.create.useMutation()
  const { session } = useSession()
  const { push } = useRouter()
  const search = useSearchParams()!
  const source = search.get('source') || '/'

  async function submitPost() {
    if (!title) {
      toast.info('Title is required')
      return
    }

    const molds = site.molds || []

    const mold = molds.find((i) => i.type === CreationType.ARTICLE)
    try {
      window.__SITE_ID__ = site.id
      await mutateAsync({
        siteId: site.id,
        title,
        description,
        moldId: mold?.id!,
        type: mold?.type!,
        areaId: '', //TODO:
        content,
        status: CreationStatus.CONTRIBUTED,
        userId: session?.userId || '',
      })
      toast.success('Your post has been submitted for review')
      push(source)
    } catch (error) {
      console.log('====error:', error)

      toast.error(extractErrorMessage(error))
    }
  }
  return (
    <div className="">
      <div className="w-full px-0 sm:px-[max(10px,calc(50%-350px))]">
        <TextareaAutosize
          className="dark:placeholder-text-600 placeholder:text-foreground/40 w-full resize-none border-none bg-transparent px-0 text-4xl font-bold focus:outline-none focus:ring-0"
          placeholder="Title"
          value={title}
          autoFocus
          onChange={(e) => {
            setTitle(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
            }
          }}
        />

        <TextareaAutosize
          className="dark:placeholder-text-600 w-full resize-none border-none bg-transparent px-0 placeholder:text-stone-400 focus:outline-none focus:ring-0"
          placeholder="Description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
            }
          }}
        />
      </div>

      <PlateEditor
        variant="post"
        className="dark:caret-brand w-full"
        value={editorDefaultValue}
        showAddButton
        showFixedToolbar
        onChange={(v) => {
          setContent(JSON.stringify(v))
        }}
      />
      <div className="fixed bottom-0 left-0 flex w-full flex-col items-center justify-center gap-1 pb-4">
        <Button
          size="lg"
          variant="outline-solid"
          // variant="brand"
          disabled={isPending}
          className="h-12 w-36 rounded-full text-lg font-bold shadow-xl"
          onClick={() => {
            submitPost()
          }}
        >
          {isPending ? (
            <LoadingDots className="bg-foreground" />
          ) : (
            'Submit post'
          )}
        </Button>
        <div className="text-foreground/50 text-sm">
          After the post is submitted, the owner will review it.
        </div>
      </div>
    </div>
  )
}
