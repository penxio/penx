'use client'

import { useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { Ellipsis } from 'lucide-react'
import { toast } from 'sonner'
import { defaultEditorContent } from '@penx/constants'
import { Creation } from '@penx/domain'
import { useCopyToClipboard } from '@penx/hooks/useCopyToClipboard'
import { useMySpace } from '@penx/hooks/useMySpace'
import { Button } from '@penx/uikit/button'
import { MenuItem } from '@penx/uikit/menu'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { useDeleteCreationDialog } from './DeleteCreationDialog/useDeleteCreationDialog'
import { usePublishDialog } from './PublishDialog/usePublishDialog'

export function CreationMoreMenu({ creation }: { creation: Creation }) {
  const [isOpen, setIsOpen] = useState(false)
  const { space } = useMySpace()
  const publishDialog = usePublishDialog()
  const deletePostDialog = useDeleteCreationDialog()
  const { locales = [] } = (space.config || {}) as {
    locales: string[]
  }

  if (!creation) return null

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal>
      <PopoverTrigger asChild className="gap-0">
        <Button
          size="xs"
          variant="ghost"
          className="h-8 w-8 rounded-full p-0"
          onClick={() => setIsOpen(true)}
        >
          <Ellipsis size={18} className="text-foreground/60"></Ellipsis>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" side="bottom" className="w-48 p-2">
        {/* {!creation.publishedAt && (
          <MenuItem
            onClick={() => {
              publishDialog.setIsOpen(true)
              setIsOpen(false)
            }}
          >
            <Trans>Publish</Trans>
          </MenuItem>
        )} */}

        <CopyMarkdown creation={creation} />

        {/* <MenuItem
          onClick={() => {
            toast.info('Coming soon...')
          }}
        >
          <Trans>Copy link</Trans>
        </MenuItem> */}
        <MenuItem
          onClick={() => {
            toast.info('Coming soon...')
          }}
        >
          <Trans>Copy html</Trans>
        </MenuItem>

        {/* {creation.publishedAt && (
          <MenuItem
            onClick={() => {
              toast.promise(
                async () => {
                  return await api.creation.unpublish.mutate({
                    creationId: creation.id,
                  })
                },
                {
                  loading: 'Unpublishing...',
                  success: 'Unpublished successfully!',
                  error: 'Failed to unpublish',
                },
              )
              setIsOpen(false)
            }}
          >
            <Trans>Unpublish</Trans>
          </MenuItem>
        )} */}

        <MenuItem
          className="text-red-500"
          onClick={() => {
            setIsOpen(false)
            deletePostDialog.setState({
              isOpen: true,
              creation: creation,
            })
          }}
        >
          <Trans>Delete</Trans>
        </MenuItem>
      </PopoverContent>
    </Popover>
  )
}

function CopyMarkdown({ creation }: { creation: Creation }) {
  const { copy } = useCopyToClipboard()
  return (
    <MenuItem
      onClick={() => {
        toast.info('Coming soon...')
      }}
    >
      Copy markdown
    </MenuItem>
  )
}
