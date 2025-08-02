import ky from 'ky'
import { syncTabs } from './syncTabs'

type BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode

export async function syncBookmarks() {
  console.log('sync123 .... bookmark......')

  chrome.bookmarks.getTree(async (bookmarkTreeNodes) => {
    const bookmarks = flattenBookmarkTree(bookmarkTreeNodes)
    await ky
      .post('http://localhost:14158/api/bookmark/createMany', {
        json: { bookmarks },
      })
      .json()
  })

  chrome.bookmarks.onCreated.addListener((id, node) => {
    console.log('New bookmark created:', id, node)
  })

  chrome.bookmarks.onRemoved.addListener((id, removeInfo) => {
    console.log('Bookmark removed:', id, removeInfo)
  })
}

export interface FlattenedBookmarkNode
  extends Omit<BookmarkTreeNode, 'children'> {
  category: string
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
