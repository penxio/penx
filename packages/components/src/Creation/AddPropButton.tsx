'use client'

import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@penx/uikit/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@penx/uikit/dropdown-menu'

export function AddPropButton() {
  return (
    <Button
      size="sm"
      variant="ghost"
      className="text-foreground/40 flex items-center gap-1 text-sm"
      onClick={() => {
        toast.info('Coming soon...')
      }}
    >
      <Plus size={16} />
      <span>Add a property</span>
    </Button>
  )
  // return (
  //   <DropdownMenu>
  //     <DropdownMenuTrigger asChild>
  //       <Button
  //         size="sm"
  //         variant="ghost"
  //         className="flex items-center gap-1 text-foreground/40 text-sm"
  //       >
  //         <Plus size={16} />
  //         <span>Add a property</span>
  //       </Button>
  //     </DropdownMenuTrigger>
  //     <DropdownMenuContent>
  //       <DropdownMenuItem
  //         onClick={() => {
  //           //
  //         }}
  //       >
  //         Text
  //       </DropdownMenuItem>
  //       <DropdownMenuItem>Number</DropdownMenuItem>
  //       <DropdownMenuItem>Select</DropdownMenuItem>
  //       <DropdownMenuItem>Multi-select</DropdownMenuItem>
  //       <DropdownMenuItem>URL</DropdownMenuItem>
  //     </DropdownMenuContent>
  //   </DropdownMenu>
  // )
}
