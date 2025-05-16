'use client'

import { CatalogueNode, CatalogueTree } from '@/lib/catalogue'
import { Link } from '@penx/libs/i18n'
import { AreaWithCreations, Site, Widget } from '@penx/types'
import { cn, getUrl } from '@penx/utils'
import { Item } from './Item'

export interface TreeItem extends Omit<CatalogueNode, 'children'> {
  children: TreeItem[]
}

export type TreeItems = TreeItem[]

interface Props {
  site: Site
  area: AreaWithCreations
  className?: string
  height?: string
}

export const PanelSidebar = ({ site, area, className, height }: Props) => {
  const widgets = (area?.widgets || []) as Widget[]
  return (
    <div
      className={cn(
        'flex w-56 shrink-0 flex-col gap-2 rounded-xl p-2',
        className,
      )}
    >
      <div className="font-bold">{area?.name}</div>
      <div className="flex-col gap-2">
        {widgets.map((widget) => {
          return <Item key={widget.id} widget={widget} />
        })}
      </div>
    </div>
  )
}
