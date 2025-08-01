import { Storage } from '@plasmohq/storage'

export function syncBookmarks() {
  console.log('sync .... bookmark......')
  chrome.bookmarks.getTree((bookmarkTreeNodes) => {
    console.log('============>>>>>>>>bookmarkTreeNodes:', bookmarkTreeNodes)
  })

  chrome.bookmarks.onCreated.addListener((id, node) => {
    console.log('New bookmark created:', id, node)
  })

  chrome.bookmarks.onRemoved.addListener((id, removeInfo) => {
    console.log('Bookmark removed:', id, removeInfo)
  })
}
