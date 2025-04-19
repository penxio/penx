import { useState } from 'react'
import { MenuItem } from '@penx/ui/components/menu/MenuItem'
import { Menu } from '@penx/ui/components/menu/Menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@penx/ui/components/popover'
import { Plus } from 'lucide-react'
import { useAddPageNodeDialog } from './AddPageNodeDialog/useAddPageNodeDialog'
import { useAddPostNodeDialog } from './AddPostNodeDialog/useAddPostNodeDialog'
import { useCategoryNodeDialog } from './CategoryNodeDialog/useCategoryNodeDialog'
import { useLinkNodeDialog } from './LinkNodeDialog/useLinkNodeDialog'

interface Props {
  parentId?: string
}

export function AddNodePopover({ parentId = '' }: Props) {
  const [open, setOpen] = useState(false)
  const addPostNodeDialog = useAddPostNodeDialog()
  const addPageNodeDialog = useAddPageNodeDialog()
  const categoryNodeDialog = useCategoryNodeDialog()
  const linkNodeDialog = useLinkNodeDialog()
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className="hover:bg-foreground/200 text-foreground/60 inline-flex h-6 w-6 cursor-pointer items-center rounded"
          onClick={async (e) => {
            e.stopPropagation()
          }}
        >
          <Plus size={16} />
        </div>
      </PopoverTrigger>
      <PopoverContent asChild className="w-48 p-0">
        <Menu>
          <MenuItem
            onClick={async () => {
              categoryNodeDialog.setState({
                parentId,
                isOpen: true,
              })
              setOpen(false)
            }}
          >
            Category
          </MenuItem>
          <MenuItem
            onClick={() => {
              addPostNodeDialog.setState({
                parentId,
                isOpen: true,
              })
              setOpen(false)
            }}
          >
            Post
          </MenuItem>
          <MenuItem
            onClick={() => {
              addPageNodeDialog.setState({
                parentId,
                isOpen: true,
              })
              setOpen(false)
            }}
          >
            Page
          </MenuItem>
          <MenuItem
            onClick={() => {
              linkNodeDialog.setState({
                parentId,
                isOpen: true,
              })
              setOpen(false)
            }}
          >
            Link
          </MenuItem>
        </Menu>
      </PopoverContent>
    </Popover>
  )
}
