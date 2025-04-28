'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@penx/uikit/ui/dialog'
import { MenuItem } from '@penx/uikit/ui/menu/MenuItem'
import { Menu } from '@penx/uikit/ui/menu/Menu'
import { usePages } from '@penx/hooks/usePages'
import { CatalogueNodeType } from '@penx/model'
import { CreationStatus } from '@penx/db/client'
import { useCatalogue } from '../hooks/useCatalogue'
import { useAddPageNodeDialog } from './useAddPageNodeDialog'

interface Props {}

export function AddPageNodeDialog({}: Props) {
  const { isOpen, setIsOpen, parentId } = useAddPageNodeDialog()
  const { data = [] } = usePages()
  const { addNode } = useCatalogue()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="grid gap-4 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="">Select a page</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <Menu className="shadow-none">
          {data.map((item) => {
            if (item.status !== CreationStatus.PUBLISHED) return null
            return (
              <MenuItem
                key={item.id}
                onClick={() => {
                  addNode(
                    {
                      uri: item.slug,
                      title: item.title,
                      type: CatalogueNodeType.PAGE,
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
