import * as React from 'react'
import { SlateLeaf, type SlateLeafProps } from '@udecode/plate'

export function CodeSyntaxLeafStatic(props: SlateLeafProps) {
  const tokenClassName = props.leaf.className as string

  return <SlateLeaf className={tokenClassName} {...props} />
}
