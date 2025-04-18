import {
  ELEMENT_A,
  ELEMENT_CODE_BLOCK,
  ELEMENT_CODE_LINE,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_HR,
  ELEMENT_IMG,
  ELEMENT_LI,
  ELEMENT_LIC,
  ELEMENT_OL,
  ELEMENT_P,
  ELEMENT_TODO,
  ELEMENT_UL,
} from '@/lib/constants'
import { getUrl } from '@/lib/utils'

export function renderSlateToHtml(nodes: any[]): string {
  const content = nodes.map((node) => renderNode(node)).join('')
  // return `
  //   <div style="max-width: 100%;line-height: 1.5;color: #374151;font-family: system-ui, -apple-system, sans-serif;">
  //   ${content}
  //   </div>
  // `.trim()
  return content.slice(0, 600)
}

function renderNode(node: any): string {
  // Text node
  if (!node.type && typeof node.text === 'string') {
    let text = node.text
    if (node.bold) text = `<strong>${text}</strong>`
    if (node.italic) text = `<em>${text}</em>`
    if (node.underline) text = `<u>${text}</u>`
    if (node.code) text = `<code>${text}</code>`
    return text
  }

  // Element node
  const children = node.children?.map(renderNode).join('') || ''

  switch (node.type) {
    case ELEMENT_P:
      if (node.listStyleType === 'disc') {
        const indent = node.indent || 1
        const style = indent === 1 ? '' : `style="margin-left: ${indent}em"`
        return `<ul ${style}><li>${children}</li></ul>`
      }
      return `<p>${children}</p>`
    case ELEMENT_H1:
      return `<h1>${children}</h1>`
    case ELEMENT_H2:
      return `<h2>${children}</h2>`
    case ELEMENT_H3:
      return `<h3>${children}</h3>`
    case ELEMENT_H4:
      return `<h4>${children}</h4>`
    case ELEMENT_H5:
      return `<h5>${children}</h5>`
    case ELEMENT_H6:
      return `<h6>${children}</h6>`
    case ELEMENT_HR:
      return `<hr />`
    case ELEMENT_UL:
      return `<ul>${children}</ul>`
    case ELEMENT_OL:
      return `<ol>${children}</ol>`
    case 'numbered-list':
      return `<ol>${children}</ol>`
    case ELEMENT_LI:
      return children
    case ELEMENT_LIC:
      return `<li>${children}</li>`
    case ELEMENT_TODO:
      const checked = node.checked
      return `<div class="todo-item ${checked ? 'checked' : ''}">${children}</div>`
    case ELEMENT_IMG:
      return `<img src="${getUrl(node.url)}" alt="" />`
    case ELEMENT_A:
      return `<a href="${node.url}" target="_blank">${children}</a>`
    case ELEMENT_CODE_BLOCK:
      return `<pre><code>${children}</code></pre>`
    case ELEMENT_CODE_LINE:
      return `<div>${children}</div>`
    default:
      return children
  }
}
