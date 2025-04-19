'use client'

import { useAreaCreationsContext } from '@/components/AreaCreationsContext'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@penx/uikit/ui/dialog'
import { MenuItem } from '@penx/uikit/ui/menu/MenuItem'
import { Menu } from '@penx/uikit/ui/menu/Menu'
import { CatalogueNodeType } from '@/lib/model'
import { CreationStatus } from '@penx/db/client'
import { useCatalogue } from '../hooks/useCatalogue'
import { useAddPostNodeDialog } from './useAddPostNodeDialog'

interface Props {}

export function AddPostNodeDialog({}: Props) {
  const { isOpen, setIsOpen, parentId } = useAddPostNodeDialog()
  const creations = useAreaCreationsContext()
  const { addNode } = useCatalogue()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="grid gap-4 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="">Select a post</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <Menu className="shadow-none">
          {creations.map((post) => {
            if (post.status !== CreationStatus.PUBLISHED) return null
            return (
              <MenuItem
                key={post.id}
                onClick={() => {
                  addNode(
                    {
                      uri: post.slug,
                      title: post.title,
                      type: CatalogueNodeType.POST,
                    },
                    parentId,
                  )
                  setIsOpen(false)
                }}
              >
                {post.title}
              </MenuItem>
            )
          })}
        </Menu>
      </DialogContent>
    </Dialog>
  )
}
