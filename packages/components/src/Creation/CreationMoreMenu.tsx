'use client'

import { useState } from 'react'
import { Trans } from '@lingui/react'
import { Ellipsis } from 'lucide-react'
import { toast } from 'sonner'
import { editorDefaultValue } from '@penx/constants'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { useCreateEditor } from '@penx/editor/use-create-editor'
import { useCopyToClipboard } from '@penx/hooks/useCopyToClipboard'
import { api } from '@penx/trpc-client'
import { CreationById, CreationType } from '@penx/types'
import { Button } from '@penx/uikit/ui/button'
import { MenuItem } from '@penx/uikit/ui/menu/MenuItem'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/ui/popover'
import { sleep } from '@penx/utils'
import { useDeletePageDialog } from '../DeletePageDialog/useDeleteDatabaseDialog'
import { useDeletePostDialog } from './DeletePostDialog/useDeletePostDialog'
import { usePublishDialog } from './PublishDialog/usePublishDialog'

export function CreationMoreMenu({ creation }: { creation: CreationById }) {
  const [isOpen, setIsOpen] = useState(false)
  const site = useSiteContext()
  const publishDialog = usePublishDialog()
  const deletePostDialog = useDeletePostDialog()
  const { locales = [] } = (site.config || {}) as {
    locales: string[]
  }

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
        <MenuItem
          onClick={() => {
            publishDialog.setIsOpen(true)
            setIsOpen(false)
          }}
        >
          <Trans id="Publish"></Trans>
        </MenuItem>

        <CopyMarkdown creation={creation} />

        <MenuItem
          onClick={() => {
            toast.info('Coming soon...')
          }}
        >
          <Trans id="Copy link"></Trans>
        </MenuItem>
        <MenuItem
          onClick={() => {
            toast.info('Coming soon...')
          }}
        >
          <Trans id="Copy html"></Trans>
        </MenuItem>

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
          <Trans id="Unpublish"></Trans>
        </MenuItem>

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
          <Trans id="Delete"></Trans>
        </MenuItem>
      </PopoverContent>
    </Popover>
  )
}

function CopyMarkdown({ creation }: { creation: CreationById }) {
  const { copy } = useCopyToClipboard()
  const editor: any = useCreateEditor({
    value: creation.content ? JSON.parse(creation.content) : editorDefaultValue,
  })
  return (
    <MenuItem
      onClick={() => {
        const content = (editor.api as any).markdown.serialize()
        copy(content)
        toast.success('Copied to clipboard')
      }}
    >
      Copy markdown
    </MenuItem>
  )
}
