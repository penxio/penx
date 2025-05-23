export function docToString(node: any) {
  if (!node) return ''

  if (node.type === 'text') {
    return node.text || ''
  }

  if (node.content && Array.isArray(node.content)) {
    return node.content.map(docToString).join('')
  }

  return ''
}

export function stringToDoc(input: string) {
  const arr: string[] = input.split('\n')
  return {
    type: 'doc',
    content: arr.map((line) => ({
      type: 'paragraph',
      content: [{ type: 'text', text: line }],
    })),
  }
}
