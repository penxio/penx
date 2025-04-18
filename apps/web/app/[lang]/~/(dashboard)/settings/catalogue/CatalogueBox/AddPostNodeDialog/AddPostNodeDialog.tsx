'use client'

import { useAreaCreationsContext } from '@/components/AreaCreationsContext'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Menu, MenuItem } from '@/components/ui/menu'
import { CatalogueNodeType } from '@/lib/model'
import { CreationStatus } from '@penx/db/client'
import { useCatalogue } from '../hooks/useCatalogue'
import { useAddPostNodeDialog } from './useAddPostNodeDialog'

interface Props {}

export function AddPostNodeDialog({}: Props) {
  const { isOpen, setIsOpen, parentId } = useAddPostNodeDialog()
  const { addNode } = useCatalogue()
  const creations = useAreaCreationsContext()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="grid gap-4 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="">Select a post</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <Menu className="shadow-none">
          {creations.map((item) => {
            if (item.status !== CreationStatus.PUBLISHED) return null
            return (
              <MenuItem
                key={item.id}
                onClick={() => {
                  addNode(
                    {
                      uri: item.slug,
                      title: item.title,
                      type: CatalogueNodeType.POST,
                    },
                    parentId,
                  )
                  setIsOpen(false)
                }}
              >
                {item.title}
              </MenuItem>
            )
          })}
        </Menu>
      </DialogContent>
    </Dialog>
  )
}
