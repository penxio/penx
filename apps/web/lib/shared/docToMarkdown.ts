import { slateToMarkdown } from '@/lib/serializer'

export function docToMarkdown(doc: any) {
  const title = doc.title
  const nodes: any[] = JSON.parse(doc.content || '[]')
  const md = slateToMarkdown(nodes)
  return `# ${title}\n` + md
}
