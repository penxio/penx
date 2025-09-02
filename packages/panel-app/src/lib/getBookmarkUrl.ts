import { Creation, Struct } from '@penx/domain'

export function getBookmarkUrl(struct: Struct, creation: Creation) {
  if (!struct.isBookmark) return ''
  const urlColumn = struct.columns.find((c) => c.slug === 'url')!
  return creation?.cells[urlColumn.id]
}
