import type { MutableRefObject } from 'react'
import { CatalogueNode } from '@/lib/catalogue'

export interface TreeItem extends Omit<CatalogueNode, 'children'> {
  children: TreeItem[]
}

export type TreeItems = TreeItem[]

export interface FlattenedItem extends TreeItem {
  parentId: string
  depth: number
  index: number
}

export type SensorContext = MutableRefObject<{
  items: FlattenedItem[]
  offset: number
}>
