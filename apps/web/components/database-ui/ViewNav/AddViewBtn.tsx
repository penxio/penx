import React, { PropsWithChildren } from 'react'
import { Button } from '@penx/ui/components/button'
import { MenuItem } from '@penx/ui/components/menu/MenuItem'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@penx/ui/components/popover'
import { ViewType } from '@/lib/types'
import { PopoverClose } from '@radix-ui/react-popover'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useDatabaseContext } from '../DatabaseProvider'
import { ViewIcon } from './ViewIcon'

interface ItemProps extends PropsWithChildren {
  viewType: ViewType
}

function Item({ children, viewType, ...rest }: ItemProps) {
  const ctx = useDatabaseContext()
  async function addView() {
    toast.info('Coming soon!')
    // const view = await ctx.addView(viewType)
    // ctx.setActiveViewId(view.id)
  }

  return (
    <PopoverClose asChild>
      <MenuItem {...rest} onClick={addView}>
        {children}
      </MenuItem>
    </PopoverClose>
  )
}

function Content() {
  return (
    <div className="p-2">
      <Item viewType={ViewType.TABLE}>
        <ViewIcon viewType={ViewType.TABLE} />
        <div>Table</div>
      </Item>
      {/* 
      <Item viewType={ViewType.LIST}>
        <ViewIcon viewType={ViewType.LIST} />
        <div>List</div>
      </Item> */}

      <Item viewType={ViewType.GALLERY}>
        <ViewIcon viewType={ViewType.GALLERY} />
        <div>Gallery</div>
      </Item>

      {/* <Item viewType={ViewType.KANBAN}>
        <ViewIcon viewType={ViewType.KANBAN} />
        <Box>Kanban</Box>
      </Item> */}
    </div>
  )
}

export const AddViewBtn = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="icon" className="h-7 w-7">
          <Plus size={18} className="text-foreground/60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-0">
        <Content />
      </PopoverContent>
    </Popover>
  )
}
