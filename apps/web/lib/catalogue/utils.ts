import { CatalogueNodeType } from '@/lib/model'
import type { CatalogueNode } from './CatalogueNode'
import { WithFlattenProps } from './types'

export function flattenTree(
  items: CatalogueNode[],
  type?: CatalogueNodeType,
  parentId: string | null = null,
  depth = 0,
): WithFlattenProps<CatalogueNode>[] {
  return items.reduce<WithFlattenProps<CatalogueNode>[]>((acc, item, index) => {
    const flattenNode = Object.assign(item, { parentId, depth, index })

    if (typeof type === 'undefined') acc.push(flattenNode)
    if (type === item.type) acc.push(flattenNode)
    if (item?.children?.length) {
      acc.push(...flattenTree(item.children || [], type, item.id, depth + 1))
    }
    return acc
  }, [])
}
