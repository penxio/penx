import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useAreaCreationsContext } from '@penx/contexts/AreaCreationsContext'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { CatalogueTree } from '@/lib/catalogue'
import { getProjection } from '@/lib/dnd-projection'
import { ICatalogueNode, INode } from '@penx/model'
import {
  closestCenter,
  defaultDropAnimation,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  KeyboardSensor,
  MeasuringStrategy,
  Modifier,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { AddPageNodeDialog } from './AddPageNodeDialog/AddPageNodeDialog'
import { AddPostNodeDialog } from './AddPostNodeDialog/AddPostNodeDialog'
import { CatalogueBoxHeader } from './CatalogueBoxHeader'
import { CatalogueItem } from './CatalogueItem'
import { CategoryNodeDialog } from './CategoryNodeDialog/CategoryNodeDialog'
import { useCatalogue } from './hooks/useCatalogue'
import { LinkNodeDialog } from './LinkNodeDialog/LinkNodeDialog'
import { SortableTreeItem } from './SortableTreeItem'
import { FlattenedItem, TreeItem, TreeItems } from './types'
import { UpdateNodeDialog } from './UpdateNodeDialog/UpdateNodeDialog'
import {
  buildTree,
  flattenTree,
  removeChildrenOf,
  setProperty,
} from './utilities'

const indentationWidth = 50

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
}

const dropAnimationConfig: DropAnimation = {
  keyframes({ transform }) {
    return [
      { opacity: 1, transform: CSS.Transform.toString(transform.initial) },
      {
        opacity: 0,
        transform: CSS.Transform.toString({
          ...transform.final,
          x: transform.final.x + 5,
          y: transform.final.y + 5,
        }),
      },
    ]
  },
  easing: 'ease-out',
  sideEffects({ active }) {
    active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: defaultDropAnimation.duration,
      easing: defaultDropAnimation.easing,
    })
  },
}

type UniqueIdentifier = string

export const CatalogueBox = () => {
  const site = useSiteContext()

  const tree = CatalogueTree.fromJSON(
    Array.isArray(site.catalogue) ? site.catalogue : [],
  )
  const creations = useAreaCreationsContext()
  const { setNodes } = useCatalogue()

  // console.log('>>>>>>>>>>>site:', site, posts)

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null)
  const [offsetLeft, setOffsetLeft] = useState(0)

  const flattenedItems = useMemo(() => {
    const flattenedTree = flattenTree(tree.nodes)
    const foldedItems = flattenedTree.reduce<string[]>(
      (acc, { children, folded, id }) =>
        folded && children.length ? [...acc, id] : acc,
      [],
    )

    return removeChildrenOf(flattenedTree, foldedItems)
  }, [tree.nodes])

  // console.log('======activeId && overId:', activeId, 'overId:', overId)

  const projected =
    activeId && overId
      ? getProjection(
          flattenedItems as any,
          activeId,
          overId,
          offsetLeft,
          indentationWidth,
        )
      : null

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
        delay: 200,
        tolerance: 0,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      // coordinateGetter,
    }),
  )

  const activeItem = activeId
    ? flattenedItems.find(({ id }) => id === activeId)
    : null

  return (
    <div className="w-full">
      <AddPostNodeDialog />
      <AddPageNodeDialog />
      <CategoryNodeDialog />
      <LinkNodeDialog />
      <UpdateNodeDialog />
      <CatalogueBoxHeader />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        measuring={measuring}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext
          items={flattenedItems}
          // strategy={verticalListSortingStrategy}
          strategy={rectSortingStrategy}
        >
          {flattenedItems.map((item) => {
            const overDepth =
              item.id === overId && projected ? projected.depth : item.depth

            const creation = creations.find((p) => p.slug === item.uri)

            return (
              <SortableTreeItem
                key={item.id}
                name={item.title || creation?.title!}
                item={item}
                depth={item.depth}
                overDepth={overDepth}
                onCollapse={async () => {
                  if (item.children?.length) {
                    handleFolded(item.id)
                  }
                }}
              />
            )
          })}

          {createPortal(
            <DragOverlay
              adjustScale={false}
              dropAnimation={dropAnimationConfig}
            >
              {activeId && activeItem ? (
                <CatalogueItem
                  item={activeItem}
                  depth={activeItem.depth}
                  name=""
                  className="opacity-80"
                />
              ) : null}
            </DragOverlay>,
            document.body,
          )}
        </SortableContext>
      </DndContext>
    </div>
  )

  function handleDragStart({ active: { id: activeId } }: DragStartEvent) {
    setActiveId(activeId as string)
    setOverId(activeId as string)

    document.body.style.setProperty('cursor', 'grabbing')
  }

  function handleDragMove({ delta }: DragMoveEvent) {
    setOffsetLeft(delta.x)
  }

  function handleDragOver({ over }: DragOverEvent) {
    setOverId((over?.id as any) ?? null)
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    resetState()

    if (!projected || !over) return

    const activeId = active.id as string
    const overId = over.id as string

    const isOverChildren = checkIsOverChildren(activeId, overId)
    if (isOverChildren) return

    const activeNode = findNode(activeId)

    const isOverSame =
      activeId === overId && activeNode.depth === projected.depth

    // is over same no need to move
    if (isOverSame) return

    const { depth, parentId } = projected

    const clonedItems: FlattenedItem[] = JSON.parse(
      JSON.stringify(flattenTree(tree.nodes)),
    )
    const overIndex = clonedItems.findIndex(({ id }) => id === over.id)
    const activeIndex = clonedItems.findIndex(({ id }) => id === active.id)

    const activeTreeItem = clonedItems[activeIndex]

    clonedItems[activeIndex] = {
      ...activeTreeItem!,
      depth,
      parentId: parentId as any,
    }

    const sortedItems = arrayMove(clonedItems, activeIndex, overIndex)
    const newItems = buildTree(sortedItems)
    setNodes(newItems)
  }

  function handleDragCancel() {
    resetState()
  }

  async function handleFolded(id: UniqueIdentifier) {
    // const newItems = setProperty(tree.nodes, id, 'folded', (value) => {
    //   return !value
    // })
    // tree.nodes = newItems
    // updateItemsState(tree.toJSON())
  }

  /**
   * find node in flattenedItems
   * @param nodeId
   * @returns
   */
  function findNode(nodeId: string) {
    return flattenedItems.find(({ id }) => id === nodeId)!
  }

  async function updateItemsState(catalogue: ICatalogueNode[]) {
    // await updateToStore(catalogue)
    // const rootNode = store.node.getRootNode()
    // await db.updateNode(rootNode.id, {
    //   props: { catalogue },
    // })
  }

  async function updateToStore(catalogue: ICatalogueNode[]) {
    // const newNodes = nodeList.nodes.map<INode>((node) => {
    //   if (node.isRootNode) {
    //     return { ...node.raw, props: { catalogue } }
    //   }
    //   return node.raw
    // })
    // store.node.setNodes(newNodes)
  }

  function checkIsOverChildren(activeId: string, overId: string) {
    const activeNode = tree.findNode(activeId)!
    const overNode = tree.findNode(overId)!
    const childrenNodes = tree.flatten(undefined, activeNode.children || [])

    const find = childrenNodes.find(({ id }) => id === overNode.id)
    return !!find
  }

  function resetState() {
    setActiveId(null)
    document.body.style.setProperty('cursor', '')
  }
}
