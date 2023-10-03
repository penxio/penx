import { PluginContext } from '@penx/plugin-typings'
import { CodeBlock } from './ui/CodeBlock'
import { CodeLine } from './ui/CodeLine'
import { withCode } from './withCode'
import './init-prism'
import { Element, Node } from 'slate'
import { CodeBlockElement, CodeLineElement, ElementType } from '../custom-types'
import { IconCode } from './IconCode'

export function activate(ctx: PluginContext) {
  ctx.registerBlock({
    with: withCode,
    elements: [
      {
        name: 'Code Block',
        icon: IconCode,
        shouldNested: true,
        type: ElementType.code_block,
        component: CodeBlock,
      },
      {
        type: ElementType.code_line,
        component: CodeLine,
      },
    ],
  })
}

export function isCodeBlock(node: Node): node is CodeBlockElement {
  return (node as Element).type === ElementType.code_block
}

export function isCodeLine(node: Node): node is CodeLineElement {
  return (node as Element).type === ElementType.code_line
}