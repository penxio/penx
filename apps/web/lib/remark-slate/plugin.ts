import { MdastNode, OptionType } from './ast-types'
import transform from './deserialize'

export default function plugin(opts?: OptionType) {
  const compiler = (node: { children: Array<MdastNode> }) => {
    return node.children.map((c) => transform(c, opts))
  }

  // @ts-ignore
  this.Compiler = compiler
}
