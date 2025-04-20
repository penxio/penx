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
import { BaseProductPlugin } from '@penx/editor/custom-plate-plugins/product'
import { ProductElementStatic } from '@penx/editor/custom-plate-plugins/product/react/product-element-static'
import { BlockquoteElementStatic } from '@penx/uikit/plate-ui/blockquote-element-static'
import { CodeBlockElement } from '@penx/uikit/plate-ui/code-block-element'
import { CodeBlockElementStatic } from '@penx/uikit/plate-ui/code-block-element-static'
import { CodeLeafStatic } from '@penx/uikit/plate-ui/code-leaf-static'
import { CodeLineElement } from '@penx/uikit/plate-ui/code-line-element'
import { CodeLineElementStatic } from '@penx/uikit/plate-ui/code-line-element-static'
import { CodeSyntaxLeaf } from '@penx/uikit/plate-ui/code-syntax-leaf'
import { CodeSyntaxLeafStatic } from '@penx/uikit/plate-ui/code-syntax-leaf-static'
import { ColumnElementStatic } from '@penx/uikit/plate-ui/column-element-static'
import { ColumnGroupElementStatic } from '@penx/uikit/plate-ui/column-group-element-static'
import { DateElementStatic } from '@penx/uikit/plate-ui/date-element-static'
import { EquationElementStatic } from '@penx/uikit/plate-ui/equation-element-static'
import { HeadingElementStatic } from '@penx/uikit/plate-ui/heading-element-static'
import { HighlightLeafStatic } from '@penx/uikit/plate-ui/highlight-leaf-static'
import { ImageElementStatic } from '@penx/uikit/plate-ui/image-element-static'
import { InlineEquationElementStatic } from '@penx/uikit/plate-ui/inline-equation-element-static'
import { LinkElementStatic } from '@penx/uikit/plate-ui/link-element-static'
import { MediaPlaceholderElement } from '@penx/uikit/plate-ui/media-placeholder-element'
import { ParagraphElementStatic } from '@penx/uikit/plate-ui/paragraph-element-static'
import {
  TableCellElementStatic,
  TableCellHeaderStaticElement,
} from '@penx/uikit/plate-ui/table-cell-element-static'
import { TableElementStatic } from '@penx/uikit/plate-ui/table-element-static'
import { TableRowElementStatic } from '@penx/uikit/plate-ui/table-row-element-static'

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
