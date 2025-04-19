import { FC, PropsWithChildren } from 'react'
import { MenuItem } from '@penx/ui/components/menu/MenuItem'
import { Menu } from '@penx/ui/components/menu/Menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@penx/ui/components/popover'
import { CatalogueNodeType, ICatalogueNode } from '@/lib/model'
import { PopoverClose } from '@radix-ui/react-popover'
import { MoreHorizontal, Trash2, User } from 'lucide-react'
import { useAddPageNodeDialog } from './AddPageNodeDialog/useAddPageNodeDialog'
import { useCategoryNodeDialog } from './CategoryNodeDialog/useCategoryNodeDialog'
import { useCatalogue } from './hooks/useCatalogue'
import { useLinkNodeDialog } from './LinkNodeDialog/useLinkNodeDialog'
import { useUpdateNodeDialog } from './UpdateNodeDialog/useUpdateNodeDialog'

interface Props {
  node: ICatalogueNode
}

export const CatalogueMenuPopover: FC<PropsWithChildren<Props>> = ({
  node,
}) => {
  const { deleteNode } = useCatalogue()
  const categoryNodeDialog = useCategoryNodeDialog()
  const linkNodeDialog = useLinkNodeDialog()
  const updateNodeDialog = useUpdateNodeDialog()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="hover:bg-foreground/200 text-foreground/600 inline-flex h-6 w-6 cursor-pointer items-center rounded">
          <MoreHorizontal size={16} />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0">
        <PopoverClose asChild>
          <MenuItem
            onClick={async (e) => {
              e.stopPropagation()
              if (node.type === CatalogueNodeType.CATEGORY) {
                categoryNodeDialog.setState({
                  isOpen: true,
                  parentId: node.id,
                  node,
                })
                return
              }

              if (node.type === CatalogueNodeType.LINK) {
                linkNodeDialog.setState({
                  isOpen: true,
                  parentId: node.id,
                  node,
                })
                return
              }

              updateNodeDialog.setState({
                isOpen: true,
                parentId: node.id,
                node,
              })
            }}
          >
            <div>Rename</div>
          </MenuItem>
        </PopoverClose>

        <PopoverClose asChild>
          <MenuItem
            onClick={async (e) => {
              e.stopPropagation()
              deleteNode(node.id)
            }}
          >
            <div>Delete</div>
          </MenuItem>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  )
}
