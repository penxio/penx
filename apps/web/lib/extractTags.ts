export function extractTags(element: any[]): string[] {
  if (!Array.isArray(element)) return []

  let tags: string[] = []

  for (const item of element) {
    if (!item?.children?.length) continue
    const result = item.children
      .filter((item: any) => item.type === 'tag')
      .map((i: any) => i.name.replace('#', ''))
    tags = [...tags, ...result]
  }
  return tags
}
