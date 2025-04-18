import { BaseProductPlugin } from '@/components/custom-plate-plugins/product'
import { ProductElementStatic } from '@/components/custom-plate-plugins/product/react/product-element-static'
import { BlockquoteElementStatic } from '@/components/plate-ui/blockquote-element-static'
import { CodeBlockElement } from '@/components/plate-ui/code-block-element'
import { CodeBlockElementStatic } from '@/components/plate-ui/code-block-element-static'
import { CodeLeafStatic } from '@/components/plate-ui/code-leaf-static'
import { CodeLineElement } from '@/components/plate-ui/code-line-element'
import { CodeLineElementStatic } from '@/components/plate-ui/code-line-element-static'
import { CodeSyntaxLeaf } from '@/components/plate-ui/code-syntax-leaf'
import { CodeSyntaxLeafStatic } from '@/components/plate-ui/code-syntax-leaf-static'
import { ColumnElementStatic } from '@/components/plate-ui/column-element-static'
import { ColumnGroupElementStatic } from '@/components/plate-ui/column-group-element-static'
import { DateElementStatic } from '@/components/plate-ui/date-element-static'
import { EquationElementStatic } from '@/components/plate-ui/equation-element-static'
import { HeadingElementStatic } from '@/components/plate-ui/heading-element-static'
import { HighlightLeafStatic } from '@/components/plate-ui/highlight-leaf-static'
import { ImageElementStatic } from '@/components/plate-ui/image-element-static'
import { InlineEquationElementStatic } from '@/components/plate-ui/inline-equation-element-static'
import { LinkElementStatic } from '@/components/plate-ui/link-element-static'
import { MediaPlaceholderElement } from '@/components/plate-ui/media-placeholder-element'
import { ParagraphElementStatic } from '@/components/plate-ui/paragraph-element-static'
import {
  TableCellElementStatic,
  TableCellHeaderStaticElement,
} from '@/components/plate-ui/table-cell-element-static'
import { TableElementStatic } from '@/components/plate-ui/table-element-static'
import { TableRowElementStatic } from '@/components/plate-ui/table-row-element-static'
import { withProps } from '@udecode/cn'
import {
  BaseBoldPlugin,
  BaseCodePlugin,
  BaseItalicPlugin,
  BaseStrikethroughPlugin,
  BaseSubscriptPlugin,
  BaseSuperscriptPlugin,
  BaseUnderlinePlugin,
} from '@udecode/plate-basic-marks'
import { BaseBlockquotePlugin } from '@udecode/plate-block-quote'
import {
  BaseCodeBlockPlugin,
  BaseCodeLinePlugin,
  BaseCodeSyntaxPlugin,
} from '@udecode/plate-code-block'
import { BaseDatePlugin } from '@udecode/plate-date'
import { BaseHighlightPlugin } from '@udecode/plate-highlight'
import { BaseColumnItemPlugin, BaseColumnPlugin } from '@udecode/plate-layout'
import { BaseLinkPlugin } from '@udecode/plate-link'
import {
  BaseEquationPlugin,
  BaseInlineEquationPlugin,
} from '@udecode/plate-math'
import {
  BaseImagePlugin,
  BaseMediaEmbedPlugin,
  BasePlaceholderPlugin,
} from '@udecode/plate-media'
import {
  BaseTableCellHeaderPlugin,
  BaseTableCellPlugin,
  BaseTablePlugin,
  BaseTableRowPlugin,
} from '@udecode/plate-table'
import { PlateLeaf } from '@udecode/plate/react'

export const components = {
  [BaseBoldPlugin.key]: withProps(PlateLeaf, { as: 'strong' }),
  [BaseItalicPlugin.key]: withProps(PlateLeaf, { as: 'em' }),
  [BaseStrikethroughPlugin.key]: withProps(PlateLeaf, { as: 's' }),
  [BaseSubscriptPlugin.key]: withProps(PlateLeaf, { as: 'sub' }),
  [BaseSuperscriptPlugin.key]: withProps(PlateLeaf, { as: 'sup' }),
  [BaseUnderlinePlugin.key]: withProps(PlateLeaf, { as: 'u' }),
  p: ParagraphElementStatic,
  h1: HeadingElementStatic,
  h2: HeadingElementStatic,
  h3: HeadingElementStatic,
  [BaseBlockquotePlugin.key]: BlockquoteElementStatic,
  [BaseDatePlugin.key]: DateElementStatic,
  [BaseCodeBlockPlugin.key]: CodeBlockElementStatic,
  [BaseCodeLinePlugin.key]: CodeLineElementStatic,
  [BaseCodeSyntaxPlugin.key]: CodeSyntaxLeafStatic,
  [BaseCodePlugin.key]: CodeLeafStatic,
  [BaseColumnPlugin.key]: ColumnGroupElementStatic,
  [BaseColumnItemPlugin.key]: ColumnElementStatic,
  [BaseImagePlugin.key]: ImageElementStatic,
  [BaseHighlightPlugin.key]: HighlightLeafStatic,
  // [BaseMediaEmbedPlugin.key]: Medieel,
  // [BaseCodeBlockPlugin.key]: CodeBlockElement,
  // [BaseCodeLinePlugin.key]: CodeLineElement,
  // [BaseCodeSyntaxPlugin.key]: CodeSyntaxLeaf,
  // [BaseCodePlugin.key]: CodeLeaf,
  [BaseEquationPlugin.key]: EquationElementStatic,
  [BaseInlineEquationPlugin.key]: InlineEquationElementStatic,
  [BaseLinkPlugin.key]: LinkElementStatic,
  [BaseTableCellHeaderPlugin.key]: TableCellHeaderStaticElement,
  [BaseTableCellPlugin.key]: TableCellElementStatic,
  [BaseTablePlugin.key]: TableElementStatic,
  [BaseTableRowPlugin.key]: TableRowElementStatic,
  [BaseProductPlugin.key]: ProductElementStatic,
}
