import { storage } from '@/lib/storage'
import { format } from 'date-fns'
import { defaultEditorContent } from '@penx/constants'
import { Creation, Struct } from '@penx/domain'
import { localDB } from '@penx/local-db'
import {
  BookmarkProps,
  IAreaNode,
  ICreationNode,
  IStructNode,
  NodeType,
} from '@penx/model-type'
import { CreationStatus, GateType } from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { api } from './api'
import { getSpaceInfo } from './getSpaceInfo'
import { sendMessage } from './message'

type BookmarkTreeNode = Browser.bookmarks.BookmarkTreeNode

export interface FlattenedBookmarkNode
  extends Omit<BookmarkTreeNode, 'children'> {
  category: string
}

export async function syncBookmarks() {
  const session = await storage.getSession()

  if (session) {
    syncInitialBookmarks()
  }

  browser.bookmarks.onCreated.addListener(async (id, node) => {
    console.log('New bookmark created:', id, node)
    const { bookmarkStruct, area } = await getSpaceInfo()
    await createBookmarkCreation(node as any, area, bookmarkStruct)
    sendMessage('bookmarkUpdated')
  })

  browser.bookmarks.onRemoved.addListener(async (id, removeInfo) => {
    console.log('Bookmark removed:', id, removeInfo)
    const bookmarks = flattenBookmarkTree([removeInfo.node])

    const { bookmarkNodes, bookmarkStruct, area } = await getSpaceInfo()
    const urls = bookmarks.map((b) => b.url!)
    const ids = bookmarkNodes
      .filter((c) => {
        const creation = new Creation(c)
        const cells = creation.getCells<BookmarkProps>(
          new Struct(bookmarkStruct),
        )
        return urls.includes(cells.url)
      })
      .map((n) => n.id)

    if (ids.length) {
      await localDB.deleteNodeByIds(ids)
      sendMessage('bookmarkUpdated')
    }
  })
}

async function syncInitialBookmarks() {
  browser.bookmarks.getTree(async (bookmarkTreeNodes) => {
    console.log('======bookmarkTreeNodes:', bookmarkTreeNodes)

    const bookmarks = flattenBookmarkTree(bookmarkTreeNodes)
    const { bookmarkNodes, bookmarkStruct, area } = await getSpaceInfo()
    console.log('=======bookmarkNodes:', bookmarkNodes)

    if (bookmarkNodes.length) return

    for (const item of bookmarks) {
      await createBookmarkCreation(item, area, bookmarkStruct)
    }

    sendMessage('bookmarkUpdated')
  })
}

export function flattenBookmarkTree(
  nodes: BookmarkTreeNode[],
  parentFolderTitle: string = '',
): FlattenedBookmarkNode[] {
  const flatList: FlattenedBookmarkNode[] = []

  function traverse(nodes: BookmarkTreeNode[], parentTitle: string) {
    for (const node of nodes) {
      if (node.url) {
        const { children, ...rest } = node
        flatList.push({
          ...rest,
          category: parentTitle,
        })
      } else if (node.children && node.children.length > 0) {
        traverse(node.children, node.title)
      }
    }
  }

  traverse(nodes, parentFolderTitle)

  return flatList
}

function getCells(bookmark: FlattenedBookmarkNode, tabStruct: IStructNode) {
  const cells = tabStruct.props.columns.reduce(
    (acc, column) => {
      let value: any = ''
      if (column.slug === 'id') value = bookmark.id
      if (column.slug === 'url') value = bookmark.url
      return { ...acc, [column.id]: value }
    },
    {} as Record<string, any>,
  )
  return cells
}

async function createBookmarkCreation(
  bookmark: FlattenedBookmarkNode,
  area: IAreaNode,
  tabStruct: IStructNode,
) {
  const cells = getCells(bookmark, tabStruct)

  const props: ICreationNode['props'] = {
    slug: uniqueId(),
    title: bookmark.title || '',
    description: '',
    content: defaultEditorContent,
    data: {},
    icon: '',
    image: '',
    type: tabStruct.type,
    cells,
    podcast: {},
    i18n: {},
    gateType: GateType.FREE,
    status: CreationStatus.DRAFT,
    commentStatus: 'OPEN',
    featured: false,
    collectible: false,
    structId: tabStruct.id,
    isJournal: false,
    isPopular: false,
    checked: false,
    delivered: false,
    commentCount: 0,
    cid: '',
    openedAt: new Date(),
    date: format(new Date(), 'yyyy-MM-dd'),
  }

  const newCreation: ICreationNode = {
    id: uniqueId(),
    spaceId: area.spaceId,
    type: NodeType.CREATION,
    areaId: area.id,
    props,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: area.userId,
  }

  // console.log('=====cells:', cells, 'newCreation:', newCreation)
  await localDB.addCreation(newCreation)
}
