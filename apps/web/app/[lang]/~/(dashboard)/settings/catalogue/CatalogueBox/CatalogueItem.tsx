import { CSSProperties, forwardRef, ReactNode, useState } from 'react'
import { MenuItem } from '@penx/uikit/ui/menu/MenuItem'
import { Menu } from '@penx/uikit/ui/menu/Menu'
import { CatalogueNode } from '@/lib/catalogue'
import { cn } from '@penx/utils'
import { useSortable } from '@dnd-kit/sortable'
import { ChevronDown, ChevronRight, Plus } from 'lucide-react'
import { AddNodePopover } from './AddNodePopover'
import { CatalogueIconPopover } from './CatalogueIconPopover'
import { CatalogueMenuPopover } from './CatalogueMenuPopover'
import { useCatalogue } from './hooks/useCatalogue'

interface CatalogueItemProps {
  depth: number
  name: string
  item: CatalogueNode
  style?: CSSProperties
  className?: string
  dragLine?: ReactNode
  listeners?: ReturnType<typeof useSortable>['listeners']
  sortable?: ReturnType<typeof useSortable>
  onCollapse?: () => void
}

export const CatalogueItem = forwardRef<HTMLDivElement, CatalogueItemProps>(
  function CatalogueItem(
    {
      item,
      name,
      depth,
      sortable,
      listeners,
      onCollapse,
      style = {},
      className,
      dragLine,
      ...rest
    }: CatalogueItemProps,
    ref,
  ) {
    const [open, setOpen] = useState(false)
    const { addNode } = useCatalogue()
    // console.log('====item:', item)

    return (
      <div
        ref={ref}
        className={cn(
          'catalogueItem hover:bg-foreground/5 relative mb-[1px] flex items-center justify-between rounded py-1 pr-2 transition-colors',
          sortable?.isOver && item.isCategory && 'bg-brand',
          className,
        )}
        style={{
          ...style,
          paddingLeft: depth * 24 + 6,
        }}
        {...listeners}
        {...rest}
      >
        {dragLine}
        <div
          className="text-foreground/50 flex h-full flex-1 cursor-pointer items-center gap-x-1"
          onClick={async (e) => {
            // const node = store.node.getNode(item.id)
            // store.node.selectNode(node)
          }}
        >
          {!!item.children?.length && (
            <div
              className="text-foreground/50 hover:bg-foreground/10 inline-flex h-5 w-5 items-center rounded"
              onKeyDown={(e) => {
                e.preventDefault()
              }}
              onPointerDown={(e) => {
                e.preventDefault()
              }}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                onCollapse?.()
              }}
            >
              {item.folded && <ChevronRight size={14} />}
              {!item.folded && <ChevronDown size={14} />}
            </div>
          )}

          <div
            className="inline-flex"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <CatalogueIconPopover node={item} />
          </div>

          <div className="text-sm font-medium">{name || 'Untitled'}</div>
        </div>
        <div className="flex items-center gap-1">
          <CatalogueMenuPopover node={item} />
          <AddNodePopover parentId={item.id} />
        </div>
      </div>
    )
  },
)
