import { Creation, Struct } from '@penx/domain'

export function getBookmarkIcon(struct: Struct, creation: Creation) {
  if (!struct.isBookmark) return ''
  const iconColumn = struct.columns.find((c) => c.slug === 'icon')!
  return creation?.cells[iconColumn.id]
}
