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
import { BaseProductPlugin } from '@penx/editor-custom-plugins'
import { ProductElementStatic } from '@penx/editor-custom-plugins'
import { BlockquoteElementStatic } from '@penx/editor-plugins/plate-ui/blockquote-element-static'
import { CodeBlockElement } from '@penx/editor-plugins/plate-ui/code-block-element'
import { CodeBlockElementStatic } from '@penx/editor-plugins/plate-ui/code-block-element-static'
import { CodeLeafStatic } from '@penx/editor-plugins/plate-ui/code-leaf-static'
import { CodeLineElement } from '@penx/editor-plugins/plate-ui/code-line-element'
import { CodeLineElementStatic } from '@penx/editor-plugins/plate-ui/code-line-element-static'
import { CodeSyntaxLeaf } from '@penx/editor-plugins/plate-ui/code-syntax-leaf'
import { CodeSyntaxLeafStatic } from '@penx/editor-plugins/plate-ui/code-syntax-leaf-static'
import { ColumnElementStatic } from '@penx/editor-plugins/plate-ui/column-element-static'
import { ColumnGroupElementStatic } from '@penx/editor-plugins/plate-ui/column-group-element-static'
import { DateElementStatic } from '@penx/editor-plugins/plate-ui/date-element-static'
import { EquationElementStatic } from '@penx/editor-plugins/plate-ui/equation-element-static'
import { HeadingElementStatic } from '@penx/editor-plugins/plate-ui/heading-element-static'
import { HighlightLeafStatic } from '@penx/editor-plugins/plate-ui/highlight-leaf-static'
import { ImageElementStatic } from '@penx/editor-plugins/plate-ui/image-element-static'
import { InlineEquationElementStatic } from '@penx/editor-plugins/plate-ui/inline-equation-element-static'
import { LinkElementStatic } from '@penx/editor-plugins/plate-ui/link-element-static'
import { MediaPlaceholderElement } from '@penx/editor-plugins/plate-ui/media-placeholder-element'
import { ParagraphElementStatic } from '@penx/editor-plugins/plate-ui/paragraph-element-static'
import {
  TableCellElementStatic,
  TableCellHeaderStaticElement,
} from '@penx/editor-plugins/plate-ui/table-cell-element-static'
import { TableElementStatic } from '@penx/editor-plugins/plate-ui/table-element-static'
import { TableRowElementStatic } from '@penx/editor-plugins/plate-ui/table-row-element-static'

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
