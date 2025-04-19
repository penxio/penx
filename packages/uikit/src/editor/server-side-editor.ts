import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu'
import { withProps } from '@udecode/cn'
import {
  BaseParagraphPlugin,
  createSlateEditor,
  serializeHtml,
  SlateLeaf,
} from '@udecode/plate'
import { BaseAlignPlugin } from '@udecode/plate-alignment'
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
import { CodeBlockPlugin } from '@udecode/plate-code-block/react'
import { BaseCommentsPlugin } from '@udecode/plate-comments'
import { BaseDatePlugin } from '@udecode/plate-date'
import {
  BaseFontBackgroundColorPlugin,
  BaseFontColorPlugin,
  BaseFontSizePlugin,
} from '@udecode/plate-font'
import {
  BaseHeadingPlugin,
  BaseTocPlugin,
  HEADING_KEYS,
  HEADING_LEVELS,
} from '@udecode/plate-heading'
import { BaseHighlightPlugin } from '@udecode/plate-highlight'
import { BaseHorizontalRulePlugin } from '@udecode/plate-horizontal-rule'
import { BaseIndentPlugin } from '@udecode/plate-indent'
import { BaseIndentListPlugin } from '@udecode/plate-indent-list'
import { BaseKbdPlugin } from '@udecode/plate-kbd'
import { BaseColumnItemPlugin, BaseColumnPlugin } from '@udecode/plate-layout'
import { BaseLineHeightPlugin } from '@udecode/plate-line-height'
import { BaseLinkPlugin } from '@udecode/plate-link'
import { MarkdownPlugin } from '@udecode/plate-markdown'
import {
  BaseEquationPlugin,
  BaseInlineEquationPlugin,
} from '@udecode/plate-math'
import {
  BaseAudioPlugin,
  BaseFilePlugin,
  BaseImagePlugin,
  BaseMediaEmbedPlugin,
  BaseVideoPlugin,
} from '@udecode/plate-media'
import { BaseMentionPlugin } from '@udecode/plate-mention'
import {
  BaseTableCellHeaderPlugin,
  BaseTableCellPlugin,
  BaseTablePlugin,
  BaseTableRowPlugin,
} from '@udecode/plate-table'
import { BaseTogglePlugin } from '@udecode/plate-toggle'
import Prism from 'prismjs'
// import { BaseBidirectionalLinkPlugin } from '@penx/uikit/editor/custom-plate-plugins/bidirectional-link'
// import { BidirectionalLinkElementStatic } from '@penx/uikit/editor/custom-plate-plugins/bidirectional-link/react/bidirectional-link-static'
// import { BaseCampaignPlugin } from '@penx/uikit/editor/custom-plate-plugins/campaign'
// import { CampaignElementStatic } from '@penx/uikit/editor/custom-plate-plugins/campaign/react/campaign-element-static'
// import { BaseCommentBoxPlugin } from '@penx/uikit/editor/custom-plate-plugins/comment-box'
// import { CommentBoxElementStatic } from '@penx/uikit/editor/custom-plate-plugins/comment-box/react/comment-box-element-static'
// import { BaseFriendsPlugin } from '@penx/uikit/editor/custom-plate-plugins/friends'
// import { FriendsElementStatic } from '@penx/uikit/editor/custom-plate-plugins/friends/react/friends-element-static'
// import { BasePodcastTimePlugin } from '@penx/uikit/editor/custom-plate-plugins/podcast-time'
// import { BaseProductPlugin } from '@penx/uikit/editor/custom-plate-plugins/product'
// import { ProductElementStatic } from '@penx/uikit/editor/custom-plate-plugins/product/react/product-element-static'
// import { BaseProjectsPlugin } from '@penx/uikit/editor/custom-plate-plugins/projects'
// import { ProjectsElementStatic } from '@penx/uikit/editor/custom-plate-plugins/projects/react/projects-element-static'
// import { BaseSocialLinksPlugin } from '@penx/uikit/editor/custom-plate-plugins/social-links'
// import { SocialLinksElementStatic } from '@penx/uikit/editor/custom-plate-plugins/social-links/react/social-links-element-static'
import { BlockquoteElementStatic } from '@penx/uikit/plate-ui/blockquote-element-static'
import { CodeBlockElementStatic } from '@penx/uikit/plate-ui/code-block-element-static'
import { CodeLeafStatic } from '@penx/uikit/plate-ui/code-leaf-static'
import { CodeLineElementStatic } from '@penx/uikit/plate-ui/code-line-element-static'
import { CodeSyntaxLeafStatic } from '@penx/uikit/plate-ui/code-syntax-leaf-static'
import { ColumnElementStatic } from '@penx/uikit/plate-ui/column-element-static'
import { ColumnGroupElementStatic } from '@penx/uikit/plate-ui/column-group-element-static'
import { CommentLeafStatic } from '@penx/uikit/plate-ui/comment-leaf-static'
import { DateElementStatic } from '@penx/uikit/plate-ui/date-element-static'
import { EditorStatic } from '@penx/uikit/plate-ui/editor-static'
import { EquationElementStatic } from '@penx/uikit/plate-ui/equation-element-static'
import { HeadingElementStatic } from '@penx/uikit/plate-ui/heading-element-static'
import { HighlightLeafStatic } from '@penx/uikit/plate-ui/highlight-leaf-static'
import { HrElementStatic } from '@penx/uikit/plate-ui/hr-element-static'
import { ImageElementStatic } from '@penx/uikit/plate-ui/image-element-static'
import {
  FireLiComponent,
  FireMarker,
} from '@penx/uikit/plate-ui/indent-fire-marker'
import {
  TodoLiStatic,
  TodoMarkerStatic,
} from '@penx/uikit/plate-ui/indent-todo-marker-static'
import { InlineEquationElementStatic } from '@penx/uikit/plate-ui/inline-equation-element-static'
import { KbdLeafStatic } from '@penx/uikit/plate-ui/kbd-leaf-static'
import { LinkElementStatic } from '@penx/uikit/plate-ui/link-element-static'
import { MediaAudioElementStatic } from '@penx/uikit/plate-ui/media-audio-element-static'
import { MediaFileElementStatic } from '@penx/uikit/plate-ui/media-file-element-static'
import { MediaVideoElementStatic } from '@penx/uikit/plate-ui/media-video-element-static'
import { MentionElementStatic } from '@penx/uikit/plate-ui/mention-element-static'
import { ParagraphElementStatic } from '@penx/uikit/plate-ui/paragraph-element-static'
import {
  TableCellElementStatic,
  TableCellHeaderStaticElement,
} from '@penx/uikit/plate-ui/table-cell-element-static'
import { TableElementStatic } from '@penx/uikit/plate-ui/table-element-static'
import { TableRowElementStatic } from '@penx/uikit/plate-ui/table-row-element-static'
import { TocElementStatic } from '@penx/uikit/plate-ui/toc-element-static'
import { ToggleElementStatic } from '@penx/uikit/plate-ui/toggle-element-static'
import { PodcastTimeElementStatic } from '../plate-ui/podcast-time-element-static'

export const serverSideComponents = {
  [BaseAudioPlugin.key]: MediaAudioElementStatic,
  [BaseBlockquotePlugin.key]: BlockquoteElementStatic,
  [BaseBoldPlugin.key]: withProps(SlateLeaf, { as: 'strong' }),
  [BaseCodeBlockPlugin.key]: CodeBlockElementStatic,
  [BaseCodeLinePlugin.key]: CodeLineElementStatic,
  [BaseCodePlugin.key]: CodeLeafStatic,
  [BaseCodeSyntaxPlugin.key]: CodeSyntaxLeafStatic,
  [BaseColumnItemPlugin.key]: ColumnElementStatic,
  [BaseColumnPlugin.key]: ColumnGroupElementStatic,
  [BaseCommentsPlugin.key]: CommentLeafStatic,
  [BaseDatePlugin.key]: DateElementStatic,
  [BaseEquationPlugin.key]: EquationElementStatic,
  [BaseFilePlugin.key]: MediaFileElementStatic,
  [BaseHighlightPlugin.key]: HighlightLeafStatic,
  [BaseHorizontalRulePlugin.key]: HrElementStatic,
  [BaseImagePlugin.key]: ImageElementStatic,
  [BaseInlineEquationPlugin.key]: InlineEquationElementStatic,
  [BaseItalicPlugin.key]: withProps(SlateLeaf, { as: 'em' }),
  [BaseKbdPlugin.key]: KbdLeafStatic,
  [BaseLinkPlugin.key]: LinkElementStatic,
  // [BaseMediaEmbedPlugin.key]: MediaEmbedElementStatic,
  [BaseMentionPlugin.key]: MentionElementStatic,
  [BaseParagraphPlugin.key]: ParagraphElementStatic,
  [BaseStrikethroughPlugin.key]: withProps(SlateLeaf, { as: 'del' }),
  [BaseSubscriptPlugin.key]: withProps(SlateLeaf, { as: 'sub' }),
  [BaseSuperscriptPlugin.key]: withProps(SlateLeaf, { as: 'sup' }),
  [BaseTableCellHeaderPlugin.key]: TableCellHeaderStaticElement,
  [BaseTableCellPlugin.key]: TableCellElementStatic,
  [BaseTablePlugin.key]: TableElementStatic,
  [BaseTableRowPlugin.key]: TableRowElementStatic,
  [BaseTocPlugin.key]: TocElementStatic,
  [BaseTogglePlugin.key]: ToggleElementStatic,
  [BaseUnderlinePlugin.key]: withProps(SlateLeaf, { as: 'u' }),
  [BaseVideoPlugin.key]: MediaVideoElementStatic,
  [HEADING_KEYS.h1]: withProps(HeadingElementStatic, { variant: 'h1' }),
  [HEADING_KEYS.h2]: withProps(HeadingElementStatic, { variant: 'h2' }),
  [HEADING_KEYS.h3]: withProps(HeadingElementStatic, { variant: 'h3' }),
  [HEADING_KEYS.h4]: withProps(HeadingElementStatic, { variant: 'h4' }),
  [HEADING_KEYS.h5]: withProps(HeadingElementStatic, { variant: 'h5' }),
  [HEADING_KEYS.h6]: withProps(HeadingElementStatic, { variant: 'h6' }),
  // [BaseProductPlugin.key]: ProductElementStatic,
  // [BaseCommentBoxPlugin.key]: CommentBoxElementStatic,
  // [BaseFriendsPlugin.key]: FriendsElementStatic,
  // [BaseProjectsPlugin.key]: ProjectsElementStatic,
  // [BaseSocialLinksPlugin.key]: SocialLinksElementStatic,
  // [BaseCampaignPlugin.key]: CampaignElementStatic,
  // [BasePodcastTimePlugin.key]: PodcastTimeElementStatic,
  // [BaseBidirectionalLinkPlugin.key]: BidirectionalLinkElementStatic,
} as any

export const serverSideEditor = createSlateEditor({
  plugins: [
    BaseColumnPlugin,
    BaseColumnItemPlugin,
    BaseTocPlugin,
    BaseVideoPlugin,
    BaseAudioPlugin,
    BaseParagraphPlugin,
    BaseHeadingPlugin,
    BaseMediaEmbedPlugin,
    BaseBoldPlugin,
    BaseCodePlugin,
    BaseItalicPlugin,
    BaseStrikethroughPlugin,
    BaseSubscriptPlugin,
    BaseSuperscriptPlugin,
    BaseUnderlinePlugin,
    BaseBlockquotePlugin,
    BaseDatePlugin,
    BaseEquationPlugin,
    BaseInlineEquationPlugin,
    BaseCodeBlockPlugin.configure({
      options: {
        prism: Prism,
      },
    }),
    BaseIndentPlugin.extend({
      inject: {
        targetPlugins: [
          BaseParagraphPlugin.key,
          BaseBlockquotePlugin.key,
          BaseCodeBlockPlugin.key,
        ],
      },
    }),
    BaseIndentListPlugin.extend({
      inject: {
        targetPlugins: [
          BaseParagraphPlugin.key,
          ...HEADING_LEVELS,
          BaseBlockquotePlugin.key,
          BaseCodeBlockPlugin.key,
          BaseTogglePlugin.key,
        ],
      },
      options: {
        listStyleTypes: {
          fire: {
            liComponent: FireLiComponent,
            markerComponent: FireMarker,
            type: 'fire',
          },
          todo: {
            liComponent: TodoLiStatic,
            markerComponent: TodoMarkerStatic,
            type: 'todo',
          },
        },
      },
    }),
    BaseLinkPlugin,
    BaseTableRowPlugin,
    BaseTablePlugin,
    BaseTableCellPlugin,
    BaseHorizontalRulePlugin,
    BaseFontColorPlugin,
    BaseFontBackgroundColorPlugin,
    BaseFontSizePlugin,
    BaseKbdPlugin,
    BaseAlignPlugin.extend({
      inject: {
        targetPlugins: [
          BaseParagraphPlugin.key,
          BaseMediaEmbedPlugin.key,
          ...HEADING_LEVELS,
          BaseImagePlugin.key,
        ],
      },
    }),
    BaseLineHeightPlugin,
    BaseHighlightPlugin,
    BaseFilePlugin,
    BaseImagePlugin,
    BaseMentionPlugin,
    BaseCommentsPlugin,
    BaseTogglePlugin,
    // BaseProductPlugin,
    // BaseCommentBoxPlugin,
    // BaseFriendsPlugin,
    // BaseProjectsPlugin,
    // BaseSocialLinksPlugin,
    // BaseCampaignPlugin,
    // BasePodcastTimePlugin,
    // BaseBidirectionalLinkPlugin,
  ],
})
