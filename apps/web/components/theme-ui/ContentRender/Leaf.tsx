import { cn } from '@/lib/utils'
import { RenderLeafProps } from 'slate-react'

export type CustomText = {
  text: string

  id?: string
  type?: any

  bold?: true
  italic?: true
  underline?: true

  /**
   * is inline code
   */
  code?: true

  strike_through?: true
  highlight?: true
  subscript?: true
  superscript?: true
  language?: string
}

export const Leaf = (p: RenderLeafProps) => {
  let { attributes, children } = p
  const leaf = p.leaf as CustomText
  const { text, ...rest } = leaf
  const className = Object.keys(rest).join(' ')

  const sharedProps = {
    ...attributes,
    className,
  }

  if (leaf.bold) {
    children = <strong {...sharedProps}>{children}</strong>
  }

  if (leaf.italic) {
    children = <em {...sharedProps}>{children}</em>
  }

  if (leaf.underline) {
    children = <u {...sharedProps}>{children}</u>
  }

  if (leaf.strike_through) {
    children = <del {...sharedProps}>{children}</del>
  }

  if (leaf.superscript) {
    children = <sup {...sharedProps}>{children}</sup>
  }

  if (leaf.subscript) {
    children = <sub {...sharedProps}>{children}</sub>
  }

  if (leaf.subscript) {
    children = <sub {...sharedProps}>{children}</sub>
  }

  if (leaf.highlight) {
    children = (
      <span {...sharedProps} className="bg-yellow-100">
        {children}
      </span>
    )
  }

  if (leaf.code) {
    children = (
      <code
        {...sharedProps}
        className={cn(
          'bg-foreground/5 rounded px-1 py-1 text-sm text-red-500',
          className,
        )}
      >
        {children}
      </code>
    )
  }

  return <span {...sharedProps}>{children}</span>
}
