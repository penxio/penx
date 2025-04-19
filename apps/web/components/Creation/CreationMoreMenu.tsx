'use client'

import { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@penx/ui/components/popover'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { Creation } from '@/hooks/useCreation'
import { editorDefaultValue } from '@/lib/constants'
import { CreationType } from '@/lib/theme.types'
import { api } from '@/lib/trpc'
import { sleep } from '@/lib/utils'
import { Trans } from '@lingui/react/macro'
import { Ellipsis } from 'lucide-react'
import { toast } from 'sonner'
import { useDeletePageDialog } from '../DeletePageDialog/useDeleteDatabaseDialog'
import { useCreateEditor } from '../editor/use-create-editor'
import { useSiteContext } from '../SiteContext'
import { Button } from '@penx/ui/components/button'
import { MenuItem } from '@penx/ui/components/menu/MenuItem'
import { useDeletePostDialog } from './DeletePostDialog/useDeletePostDialog'
import { usePublishDialog } from './PublishDialog/usePublishDialog'

export function CreationMoreMenu({ creation }: { creation: Creation }) {
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
          <Trans>Publish</Trans>
        </MenuItem>

        <CopyMarkdown creation={creation} />

        <MenuItem
          onClick={() => {
            toast.info('Coming soon...')
          }}
        >
          <Trans>Copy link</Trans>
        </MenuItem>
        <MenuItem
          onClick={() => {
            toast.info('Coming soon...')
          }}
        >
          <Trans>Copy html</Trans>
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
          <Trans>Unpublish</Trans>
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
          <Trans>Delete</Trans>
        </MenuItem>
      </PopoverContent>
    </Popover>
  )
}

function CopyMarkdown({ creation }: { creation: Creation }) {
  const { copy } = useCopyToClipboard()
  const editor = useCreateEditor({
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
