'use client'

import { useState } from 'react'
import { CopyIcon, Trash2Icon } from 'lucide-react'
import { IView } from '@penx/model-type'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@penx/uikit/ui/context-menu'
import { Input } from '@penx/uikit/ui/input'
import { cn, mappedByKey } from '@penx/utils'
import { useDatabaseContext } from '../DatabaseProvider'
import { ViewIcon } from './ViewIcon'

interface Props {
  index: number
  view: IView
}
export const ViewItem = ({ view, index }: Props) => {
  const { activeViewId, setActiveViewId, updateView, deleteView } =
    useDatabaseContext()

  const active = activeViewId === view.id
  return (
    <ContextMenu key={view.id}>
      <ContextMenuTrigger asChild className="">
        <div
          className={cn(
            'text-foreground/50 hover:bg-foreground/5 flex h-7 cursor-pointer items-center justify-center gap-1 rounded px-3',
            active && 'text-foreground bg-foreground/5',
          )}
          onClick={async () => {
            setActiveViewId(view.id)
          }}
        >
          <ViewIcon viewType={view.viewType} />
          <div className="shrink-0 text-sm font-medium">{view.name}</div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <div className="p-2">
          <div className="text-foreground/40 mb-1 text-xs">Name</div>
          <Input
            size="sm"
            value={view.name}
            onChange={(e) => {
              updateView(view.id, { name: e.target.value })
            }}
          />
        </div>

        <ContextMenuItem disabled>
          <CopyIcon />
          <span>Duplicate</span>
        </ContextMenuItem>
        <ContextMenuItem
          disabled={index === 0}
          onClick={() => {
            deleteView(view.id)
          }}
        >
          <Trash2Icon />
          <span>Delete</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
