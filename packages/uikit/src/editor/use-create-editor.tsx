'use client'

// import { AIPlugin } from '@penx/uikit/editor/custom-plate-plugins/plate-ai/react'
import { withProps } from '@udecode/cn'
import type { Value } from '@udecode/plate'
import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  UnderlinePlugin,
} from '@udecode/plate-basic-marks/react'
import { BlockquotePlugin } from '@udecode/plate-block-quote/react'
import {
  CodeBlockPlugin,
  CodeLinePlugin,
  CodeSyntaxPlugin,
} from '@udecode/plate-code-block/react'
import { CommentsPlugin } from '@udecode/plate-comments/react'
import { DatePlugin } from '@udecode/plate-date/react'
import { EmojiInputPlugin } from '@udecode/plate-emoji/react'
import { ExcalidrawPlugin } from '@udecode/plate-excalidraw/react'
import { HEADING_KEYS } from '@udecode/plate-heading'
import { TocPlugin } from '@udecode/plate-heading/react'
import { HighlightPlugin } from '@udecode/plate-highlight/react'
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react'
import { KbdPlugin } from '@udecode/plate-kbd/react'
import { ColumnItemPlugin, ColumnPlugin } from '@udecode/plate-layout/react'
import { LinkPlugin } from '@udecode/plate-link/react'
import { EquationPlugin, InlineEquationPlugin } from '@udecode/plate-math/react'
import {
  AudioPlugin,
  FilePlugin,
  ImagePlugin,
  MediaEmbedPlugin,
  PlaceholderPlugin,
  VideoPlugin,
} from '@udecode/plate-media/react'
import { MentionInputPlugin, MentionPlugin } from '@udecode/plate-mention/react'
import { SlashInputPlugin } from '@udecode/plate-slash-command/react'
import { SuggestionPlugin } from '@udecode/plate-suggestion/react'
import {
  TableCellHeaderPlugin,
  TableCellPlugin,
  TablePlugin,
  TableRowPlugin,
} from '@udecode/plate-table/react'
import { TogglePlugin } from '@udecode/plate-toggle/react'
import {
  ParagraphPlugin,
  PlateLeaf,
  usePlateEditor,
  type CreatePlateEditorOptions,
} from '@udecode/plate/react'
import { copilotPlugins } from '@penx/uikit/editor/plugins/copilot-plugins'
import { editorPlugins } from '@penx/uikit/editor/plugins/editor-plugins'
import { FixedToolbarPlugin } from '@penx/uikit/editor/plugins/fixed-toolbar-plugin'
import { FloatingToolbarPlugin } from '@penx/uikit/editor/plugins/floating-toolbar-plugin'
import { AILeaf } from '@penx/uikit/plate-ui/ai-leaf'
import { BlockquoteElement } from '@penx/uikit/plate-ui/blockquote-element'
import { CodeBlockElement } from '@penx/uikit/plate-ui/code-block-element'
import { CodeLeaf } from '@penx/uikit/plate-ui/code-leaf'
import { CodeLineElement } from '@penx/uikit/plate-ui/code-line-element'
import { CodeSyntaxLeaf } from '@penx/uikit/plate-ui/code-syntax-leaf'
import { ColumnElement } from '@penx/uikit/plate-ui/column-element'
import { ColumnGroupElement } from '@penx/uikit/plate-ui/column-group-element'
import { CommentLeaf } from '@penx/uikit/plate-ui/comment-leaf'
import { DateElement } from '@penx/uikit/plate-ui/date-element'
import { EmojiInputElement } from '@penx/uikit/plate-ui/emoji-input-element'
import { EquationElement } from '@penx/uikit/plate-ui/equation-element'
import { ExcalidrawElement } from '@penx/uikit/plate-ui/excalidraw-element'
import { HeadingElement } from '@penx/uikit/plate-ui/heading-element'
import { HighlightLeaf } from '@penx/uikit/plate-ui/highlight-leaf'
import { HrElement } from '@penx/uikit/plate-ui/hr-element'
import { ImageElement } from '@penx/uikit/plate-ui/image-element'
import { InlineEquationElement } from '@penx/uikit/plate-ui/inline-equation-element'
import { KbdLeaf } from '@penx/uikit/plate-ui/kbd-leaf'
import { LinkElement } from '@penx/uikit/plate-ui/link-element'
import { MediaAudioElement } from '@penx/uikit/plate-ui/media-audio-element'
import { MediaEmbedElement } from '@penx/uikit/plate-ui/media-embed-element'
import { MediaFileElement } from '@penx/uikit/plate-ui/media-file-element'
import { MediaPlaceholderElement } from '@penx/uikit/plate-ui/media-placeholder-element'
import { MediaVideoElement } from '@penx/uikit/plate-ui/media-video-element'
import { MentionElement } from '@penx/uikit/plate-ui/mention-element'
import { MentionInputElement } from '@penx/uikit/plate-ui/mention-input-element'
import { ParagraphElement } from '@penx/uikit/plate-ui/paragraph-element'
import { withPlaceholders } from '@penx/uikit/plate-ui/placeholder'
import { SlashInputElement } from '@penx/uikit/plate-ui/slash-input-element'
import { SuggestionLeaf } from '@penx/uikit/plate-ui/suggestion-leaf'
import {
  TableCellElement,
  TableCellHeaderElement,
} from '@penx/uikit/plate-ui/table-cell-element'
import { TableElement } from '@penx/uikit/plate-ui/table-element'
import { TableRowElement } from '@penx/uikit/plate-ui/table-row-element'
import { TocElement } from '@penx/uikit/plate-ui/toc-element'
import { ToggleElement } from '@penx/uikit/plate-ui/toggle-element'

// import {
//   BidirectionalLinkInputPlugin,
//   BidirectionalLinkPlugin,
// } from '@penx/uikit/editor/custom-plate-plugins/bidirectional-link/react'
// import { BidirectionalLinkElement } from '@penx/uikit/editor/custom-plate-plugins/bidirectional-link/react/bidirectional-link-element'
// import { BidirectionalLinkInputElement } from '@penx/uikit/editor/custom-plate-plugins/bidirectional-link/react/bidirectional-link-input-element'
// import { CampaignPlugin } from '@penx/uikit/editor/custom-plate-plugins/campaign/react'
// import { CampaignElement } from '@penx/uikit/editor/custom-plate-plugins/campaign/react/campaign-element'
// import { CommentBoxPlugin } from '@penx/uikit/editor/custom-plate-plugins/comment-box/react'
// import { CommentBoxElement } from '@penx/uikit/editor/custom-plate-plugins/comment-box/react/comment-box-element'
// import { FriendsPlugin } from '@penx/uikit/editor/custom-plate-plugins/friends/react'
// import { FriendsElement } from '@penx/uikit/editor/custom-plate-plugins/friends/react/friends-element'
// import { PodcastTimePlugin } from '@penx/uikit/editor/custom-plate-plugins/podcast-time/react'
// import { ProductPlugin } from '@penx/uikit/editor/custom-plate-plugins/product/react'
// import { ProductElement } from '@penx/uikit/editor/custom-plate-plugins/product/react/product-element'
// import { ProjectsPlugin } from '@penx/uikit/editor/custom-plate-plugins/projects/react'
// import { ProjectsElement } from '@penx/uikit/editor/custom-plate-plugins/projects/react/projects-element'
// import { SocialLinksPlugin } from '@penx/uikit/editor/custom-plate-plugins/social-links/react'
// import { SocialLinksElement } from '@penx/uikit/editor/custom-plate-plugins/social-links/react/social-links-element'
// import { PodcastTimeElement } from '../plate-ui/podcast-time-element'

export const viewComponents = {
  [AudioPlugin.key]: MediaAudioElement,
  [BlockquotePlugin.key]: BlockquoteElement,
  [BoldPlugin.key]: withProps(PlateLeaf, { as: 'strong' }),
  [CodeBlockPlugin.key]: CodeBlockElement,
  [CodeLinePlugin.key]: CodeLineElement,
  [CodePlugin.key]: CodeLeaf,
  [CodeSyntaxPlugin.key]: CodeSyntaxLeaf,
  [ColumnItemPlugin.key]: ColumnElement,
  [ColumnPlugin.key]: ColumnGroupElement,
  [CommentsPlugin.key]: CommentLeaf,
  [DatePlugin.key]: DateElement,
  [EquationPlugin.key]: EquationElement,
  [ExcalidrawPlugin.key]: ExcalidrawElement,
  [FilePlugin.key]: MediaFileElement,
  [HEADING_KEYS.h1]: withProps(HeadingElement, { variant: 'h1' }),
  [HEADING_KEYS.h2]: withProps(HeadingElement, { variant: 'h2' }),
  [HEADING_KEYS.h3]: withProps(HeadingElement, { variant: 'h3' }),
  [HEADING_KEYS.h4]: withProps(HeadingElement, { variant: 'h4' }),
  [HEADING_KEYS.h5]: withProps(HeadingElement, { variant: 'h5' }),
  [HEADING_KEYS.h6]: withProps(HeadingElement, { variant: 'h6' }),
  [HighlightPlugin.key]: HighlightLeaf,
  [HorizontalRulePlugin.key]: HrElement,
  [ImagePlugin.key]: ImageElement,
  [InlineEquationPlugin.key]: InlineEquationElement,
  [ItalicPlugin.key]: withProps(PlateLeaf, { as: 'em' }),
  [KbdPlugin.key]: KbdLeaf,
  [LinkPlugin.key]: LinkElement,
  [MediaEmbedPlugin.key]: MediaEmbedElement,
  [MentionPlugin.key]: MentionElement,
  [ParagraphPlugin.key]: ParagraphElement,
  [PlaceholderPlugin.key]: MediaPlaceholderElement,
  [StrikethroughPlugin.key]: withProps(PlateLeaf, { as: 's' }),
  [SubscriptPlugin.key]: withProps(PlateLeaf, { as: 'sub' }),
  [SuggestionPlugin.key]: SuggestionLeaf,
  [SuperscriptPlugin.key]: withProps(PlateLeaf, { as: 'sup' }),
  [TableCellHeaderPlugin.key]: TableCellHeaderElement,
  [TableCellPlugin.key]: TableCellElement,
  [TablePlugin.key]: TableElement,
  [TableRowPlugin.key]: TableRowElement,
  [TocPlugin.key]: TocElement,
  [TogglePlugin.key]: ToggleElement,
  [UnderlinePlugin.key]: withProps(PlateLeaf, { as: 'u' }),
  [VideoPlugin.key]: MediaVideoElement,
  // [BidirectionalLinkPlugin.key]: BidirectionalLinkElement,
  // [ProductPlugin.key]: ProductElement,
  // [CommentBoxPlugin.key]: CommentBoxElement,
  // [FriendsPlugin.key]: FriendsElement,
  // [ProjectsPlugin.key]: ProjectsElement,
  // [SocialLinksPlugin.key]: SocialLinksElement,
  // [CampaignPlugin.key]: CampaignElement,
  // [PodcastTimePlugin.key]: PodcastTimeElement,
}

export const editorComponents = {
  ...viewComponents,
  // [AIPlugin.key]: AILeaf,
  [EmojiInputPlugin.key]: EmojiInputElement,
  [MentionInputPlugin.key]: MentionInputElement,
  // [BidirectionalLinkInputPlugin.key]: BidirectionalLinkInputElement,
  [SlashInputPlugin.key]: SlashInputElement,
}

export type PlateEditorType = ReturnType<typeof useCreateEditor>

export const useCreateEditor = (
  {
    components,
    override,
    readOnly,
    value,
    placeholder,
    showFixedToolbar,
    ...options
  }: {
    components?: Record<string, any>
    plugins?: any[]
    readOnly?: boolean
    showFixedToolbar?: boolean
    placeholder?: string
  } & Omit<CreatePlateEditorOptions, 'plugins'> = {},
  deps: any[] = [],
) => {
  let editorValue = value as any
  if (typeof editorValue === 'string') {
    editorValue = JSON.parse(editorValue)
  }
  const editor = usePlateEditor<Value>(
    {
      override: {
        components: {
          ...(readOnly
            ? viewComponents
            : withPlaceholders(editorComponents, placeholder)),
          ...components,
        },
        ...override,
      },
      plugins: [
        ...copilotPlugins,
        ...editorPlugins,
        FloatingToolbarPlugin,
        ...(showFixedToolbar ? [FixedToolbarPlugin] : []),
      ],
      value: editorValue,
      ...options,
    },
    deps,
  )
  return editor
}
