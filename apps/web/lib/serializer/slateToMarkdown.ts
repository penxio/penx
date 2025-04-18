import { Node } from 'slate'

// import { CustomElement, LinkElement, ListElement } from '@/lib/editor-types'

// export function slateToMarkdown(nodes: CustomElement[]) {
export function slateToMarkdown(nodes: any) {
  //   const output: string[] = []
  //   for (const node of nodes) {
  //     if (node.type === ElementType.h1) {
  //       output.push('# ' + Node.string(node) + '\n')
  //       continue
  //     }
  //     if (node.type === ElementType.h2) {
  //       output.push('## ' + Node.string(node) + '\n')
  //       continue
  //     }
  //     if (node.type === ElementType.h3) {
  //       output.push('### ' + Node.string(node) + '\n')
  //       continue
  //     }
  //     if (node.type === ElementType.h4) {
  //       output.push('#### ' + Node.string(node) + '\n')
  //       continue
  //     }
  //     if (node.type === ElementType.h5) {
  //       output.push('##### ' + Node.string(node) + '\n')
  //       continue
  //     }
  //     if (node.type === ElementType.h6) {
  //       output.push('###### ' + Node.string(node) + '\n')
  //       continue
  //     }
  //     if (node.type === ElementType.p) {
  //       const str = node.children.reduce((acc, child) => {
  //         if (child.type === ElementType.link) {
  //           const link = child as LinkElement
  //           const linkStr = `[${Node.string(link)}](${link.url})`
  //           return acc + linkStr
  //         } else {
  //           return acc + Node.string(child)
  //         }
  //       }, '')
  //       output.push(str + '\n')
  //       continue
  //     }
  //     if (node.type === ElementType.blockquote) {
  //       output.push('> ' + Node.string(node) + '\n')
  //       continue
  //     }
  //     if (node.type === ElementType.hr) {
  //       output.push('---' + '\n')
  //       continue
  //     }
  //     if (node.type === ElementType.img) {
  //       const { url = '' } = node
  //       const name = url.split('/').pop()
  //       const str = `![${name}](${url})\n`
  //       output.push(str)
  //       continue
  //     }
  //     if (node.type === ElementType.todo) {
  //       const x = node.checked ? 'x' : ' '
  //       output.push(`- [${x}] ` + Node.string(node))
  //       continue
  //     }
  //     if (node.type === ElementType.ul) {
  //       const result = getLisMd(node)
  //       output.push(...result)
  //       continue
  //     }
  //     if (node.type === ElementType.code_block) {
  //       const meta: string[] = [node.language]
  //       if (node.showLineNumbers) meta.push('showLineNumbers')
  //       if (node.highlightingLines?.length) {
  //         meta.push(`{${node.highlightingLines.join(',')}}`)
  //       }
  //       if (node.title) {
  //         meta.push(`title="${node.title}"`)
  //       }
  //       output.push(`${'```'}${meta.join(' ')}`)
  //       for (const item of node.children || []) {
  //         output.push(Node.string(item))
  //       }
  //       output.push('```' + '\n')
  //       continue
  //     }
  //     if (node.type === ElementType.table) {
  //       const result: string[] = []
  //       node.children.forEach((row, i) => {
  //         const rowArr = row.children.reduce((acc, cell) => {
  //           acc.push(Node.string(cell))
  //           return acc
  //         }, [] as string[])
  //         const rowStr = `|${rowArr.join('|')}|`
  //         result.push(rowStr)
  //         if (i === 0) {
  //           const alignArr = row.children.reduce((acc, cell) => {
  //             acc.push('---')
  //             return acc
  //           }, [] as string[])
  //           const alignStr = `|${alignArr.join('|')}|`
  //           result.push(alignStr)
  //         }
  //       })
  //       output.push(...result)
  //       continue
  //     }
  //     output.push(Node.string(node))
  //   }
  //   return output.join('\n')
  // }
  // function getLisMd(node: ListElement) {
  //   const result: string[] = []
  //   function traverseTree(
  //     treeNode: ListElement,
  //     level: number,
  //     parentType: any,
  //     index: number,
  //   ): void {
  //     if (
  //       treeNode.children?.length &&
  //       treeNode.type !== (ElementType.lic as any)
  //     ) {
  //       if (treeNode.type === (ElementType.li as any)) {
  //         level++
  //       }
  //       if ([ElementType.ol, ElementType.ul].includes(treeNode.type)) {
  //         parentType = treeNode.type
  //         index = 0
  //       }
  //       for (const child of treeNode.children) {
  //         index++
  //         traverseTree(child as any, level, parentType, index)
  //       }
  //     } else {
  //       const pad = Array(level - 1)
  //         .fill('  ')
  //         .join('')
  //       const liStr = parentType === ElementType.ul ? '-' : `${index - 1}.`
  //       result.push(pad + `${liStr} ` + Node.string(treeNode))
  //     }
  //   }
  //   traverseTree(node, 0, node.type, 0)
  //   return result

  return ''
}
