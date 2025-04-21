'use client'

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
import {
  AIPlugin,
  BidirectionalLinkElement,
  BidirectionalLinkInputElement,
  BidirectionalLinkInputPlugin,
  BidirectionalLinkPlugin,
  CampaignElement,
  CampaignPlugin,
  CommentBoxElement,
  CommentBoxPlugin,
  FriendsElement,
  FriendsPlugin,
  PodcastTimeElement,
  PodcastTimePlugin,
  ProductElement,
  ProductPlugin,
  ProjectsElement,
  ProjectsPlugin,
  SocialLinksElement,
  SocialLinksPlugin,
} from '@penx/editor-custom-plugins'
import { copilotPlugins } from '@penx/editor-plugins/plugins/copilot-plugins'
import { editorPlugins } from '@penx/editor-plugins/plugins/editor-plugins'
import { FixedToolbarPlugin } from '@penx/editor-plugins/plugins/fixed-toolbar-plugin'
import { FloatingToolbarPlugin } from '@penx/editor-plugins/plugins/floating-toolbar-plugin'
import { AILeaf } from '@penx/editor-plugins/plate-ui/ai-leaf'
import { BlockquoteElement } from '@penx/editor-plugins/plate-ui/blockquote-element'
import { CodeBlockElement } from '@penx/editor-plugins/plate-ui/code-block-element'
import { CodeLeaf } from '@penx/editor-plugins/plate-ui/code-leaf'
import { CodeLineElement } from '@penx/editor-plugins/plate-ui/code-line-element'
import { CodeSyntaxLeaf } from '@penx/editor-plugins/plate-ui/code-syntax-leaf'
import { ColumnElement } from '@penx/editor-plugins/plate-ui/column-element'
import { ColumnGroupElement } from '@penx/editor-plugins/plate-ui/column-group-element'
import { CommentLeaf } from '@penx/editor-plugins/plate-ui/comment-leaf'
import { DateElement } from '@penx/editor-plugins/plate-ui/date-element'
import { EmojiInputElement } from '@penx/editor-plugins/plate-ui/emoji-input-element'
import { EquationElement } from '@penx/editor-plugins/plate-ui/equation-element'
import { ExcalidrawElement } from '@penx/editor-plugins/plate-ui/excalidraw-element'
import { HeadingElement } from '@penx/editor-plugins/plate-ui/heading-element'
import { HighlightLeaf } from '@penx/editor-plugins/plate-ui/highlight-leaf'
import { HrElement } from '@penx/editor-plugins/plate-ui/hr-element'
import { ImageElement } from '@penx/editor-plugins/plate-ui/image-element/image-element'
import { InlineEquationElement } from '@penx/editor-plugins/plate-ui/inline-equation-element'
import { KbdLeaf } from '@penx/editor-plugins/plate-ui/kbd-leaf'
import { LinkElement } from '@penx/editor-plugins/plate-ui/link-element'
import { MediaAudioElement } from '@penx/editor-plugins/plate-ui/media-audio-element'
import { MediaEmbedElement } from '@penx/editor-plugins/plate-ui/media-embed-element'
import { MediaFileElement } from '@penx/editor-plugins/plate-ui/media-file-element'
import { MediaPlaceholderElement } from '@penx/editor-plugins/plate-ui/media-placeholder-element'
import { MediaVideoElement } from '@penx/editor-plugins/plate-ui/media-video-element'
import { MentionElement } from '@penx/editor-plugins/plate-ui/mention-element'
import { MentionInputElement } from '@penx/editor-plugins/plate-ui/mention-input-element'
import { ParagraphElement } from '@penx/editor-plugins/plate-ui/paragraph-element'
import { withPlaceholders } from '@penx/editor-plugins/plate-ui/placeholder'
import { SlashInputElement } from '@penx/editor-plugins/plate-ui/slash-input-element'
import { SuggestionLeaf } from '@penx/editor-plugins/plate-ui/suggestion-leaf'
import {
  TableCellElement,
  TableCellHeaderElement,
} from '@penx/editor-plugins/plate-ui/table-cell-element'
import { TableElement } from '@penx/editor-plugins/plate-ui/table-element'
import { TableRowElement } from '@penx/editor-plugins/plate-ui/table-row-element'
import { TocElement } from '@penx/editor-plugins/plate-ui/toc-element'
import { ToggleElement } from '@penx/editor-plugins/plate-ui/toggle-element'

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
  [BidirectionalLinkPlugin.key]: BidirectionalLinkElement,
  [ProductPlugin.key]: ProductElement,
  [CommentBoxPlugin.key]: CommentBoxElement,
  [FriendsPlugin.key]: FriendsElement,
  [ProjectsPlugin.key]: ProjectsElement,
  [SocialLinksPlugin.key]: SocialLinksElement,
  [CampaignPlugin.key]: CampaignElement,
  [PodcastTimePlugin.key]: PodcastTimeElement,
}

export const editorComponents = {
  ...viewComponents,
  [AIPlugin.key]: AILeaf,
  [EmojiInputPlugin.key]: EmojiInputElement,
  [MentionInputPlugin.key]: MentionInputElement,
  [BidirectionalLinkInputPlugin.key]: BidirectionalLinkInputElement,
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
