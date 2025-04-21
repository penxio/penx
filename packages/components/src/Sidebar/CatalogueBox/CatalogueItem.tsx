import { CSSProperties, forwardRef, ReactNode, useState } from 'react'
import { AddCreationButton } from '@penx/components/AddCreationButton'
import { Badge } from '@penx/uikit/ui/badge'
import { Button } from '@penx/uikit/ui/button'
import { MenuItem } from '@penx/uikit/ui/menu/MenuItem'
import { Menu } from '@penx/uikit/ui/menu/Menu'
import { CatalogueNode } from '@/lib/catalogue'
import { Link } from '@penx/libs/i18n'
import { CatalogueNodeType } from '@penx/model'
import { cn } from '@penx/utils'
import { useSortable } from '@dnd-kit/sortable'
import { Trans } from '@lingui/react'
import { Creation } from '@prisma/client'
import { format } from 'date-fns'
import {
  ChevronDown,
  ChevronRight,
  Edit3Icon,
  Plus,
  PlusIcon,
} from 'lucide-react'
import { AddNodePopover } from './AddNodePopover'
import { CatalogueIconPopover } from './CatalogueIconPopover'
import { CatalogueMenuPopover } from './CatalogueMenuPopover'
import { useCatalogue } from './hooks/useCatalogue'

interface CatalogueItemProps {
  depth: number
  name: string
  item: CatalogueNode
  creation: Creation
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
      creation,
      name,
      depth,
      sortable,
      listeners,
      onCollapse,
      className,
      dragLine,
      style = {},
      ...rest
    }: CatalogueItemProps,
    ref,
  ) {
    const [open, setOpen] = useState(false)
    const { addNode } = useCatalogue()
    // console.log('====item:', item)
    const isCategory = item.type === CatalogueNodeType.CATEGORY

    return (
      <div
        ref={ref}
        className={cn(
          'catalogueItem relative mb-[1px] flex items-center justify-between rounded py-1 pr-2 transition-colors',
          sortable?.isOver && isCategory && 'bg-foreground/5',
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
          className="flex h-full flex-1 cursor-pointer items-center gap-x-1"
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

          {/* <div
            className="inline-flex"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <CatalogueIconPopover node={item} />
          </div> */}

          <div className="flex items-center gap-2">
            {isCategory && (
              <div
                className={cn(
                  'hover:text-brand origin-left text-lg font-semibold transition-all hover:scale-105',
                )}
              >
                {name || 'Untitled'}
              </div>
            )}
            {creation && (
              <Link
                href={`/~/areas/${creation.areaId!}/creation?id=${creation.id}`}
                className={cn(
                  'hover:text-brand origin-left text-sm transition-all',
                )}
              >
                {name || 'Untitled'}
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <CatalogueMenuPopover node={item} />
          {/* <AddNodePopover parentId={item.id} /> */}

          {/* <CreatePostButton>
            <Button size="icon" className="size-8">
              <PlusIcon size={20} className="" />
            </Button>
          </CreatePostButton> */}
        </div>
      </div>
    )
  },
)
