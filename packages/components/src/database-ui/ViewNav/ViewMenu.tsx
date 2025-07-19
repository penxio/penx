'use client'

import { useState } from 'react'
import { MenuItem } from '@ariakit/react'
import { Copy, MoreVertical, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@penx/uikit/button'
import { Input } from '@penx/uikit/input'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { Separator } from '@penx/uikit/separator'
import { useDatabaseContext } from '../../DatabaseProvider'

interface ViewMenuProps {
  index: number
  view: any
}

export const ViewMenu = ({ view, index }: ViewMenuProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost">
          <MoreVertical />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Content view={view} index={index} />
      </PopoverContent>
    </Popover>
  )
}

function Content({ view, index }: ViewMenuProps) {
  // const { close } = usePopoverContext()
  const { updateView, deleteView, setActiveViewId } = useDatabaseContext()
  const [name, setName] = useState(view.name || '')

  return (
    <>
      <div className="p-2">
        <Input
          size="sm"
          value={name}
          onBlur={() => {
            updateView(view.id, { name })
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateView(view.id, { name })
              // close()
            }
          }}
          onChange={(e) => {
            setName(e.target.value)
          }}
        />
      </div>
      <Separator />

      <MenuItem
        onClick={() => {
          toast.info('Coming soon..')
          close()
        }}
      >
        <div>
          <Copy size={16} />
        </div>
        <div>Duplicate View</div>
      </MenuItem>

      <MenuItem
        disabled={index === 0}
        onClick={async () => {
          // if (index === 0) return
          // await deleteView(view.id)
          // setActiveViewId(database.props.viewIds[0])
          // close()
        }}
      >
        <div>
          <Trash2 size={16} />
        </div>
        <div>Delete View</div>
      </MenuItem>
    </>
  )
}
