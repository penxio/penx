'use client'

import { AIPlugin } from '@/components/custom-plate-plugins/plate-ai/react'
import { copilotPlugins } from '@/components/editor/plugins/copilot-plugins'
import { editorPlugins } from '@/components/editor/plugins/editor-plugins'
import { FixedToolbarPlugin } from '@/components/editor/plugins/fixed-toolbar-plugin'
import { FloatingToolbarPlugin } from '@/components/editor/plugins/floating-toolbar-plugin'
import { AILeaf } from '@/components/plate-ui/ai-leaf'
import { BlockquoteElement } from '@/components/plate-ui/blockquote-element'
import { CodeBlockElement } from '@/components/plate-ui/code-block-element'
import { CodeLeaf } from '@/components/plate-ui/code-leaf'
import { CodeLineElement } from '@/components/plate-ui/code-line-element'
import { CodeSyntaxLeaf } from '@/components/plate-ui/code-syntax-leaf'
import { ColumnElement } from '@/components/plate-ui/column-element'
import { ColumnGroupElement } from '@/components/plate-ui/column-group-element'
import { CommentLeaf } from '@/components/plate-ui/comment-leaf'
import { DateElement } from '@/components/plate-ui/date-element'
import { EmojiInputElement } from '@/components/plate-ui/emoji-input-element'
import { EquationElement } from '@/components/plate-ui/equation-element'
import { ExcalidrawElement } from '@/components/plate-ui/excalidraw-element'
import { HeadingElement } from '@/components/plate-ui/heading-element'
import { HighlightLeaf } from '@/components/plate-ui/highlight-leaf'
import { HrElement } from '@/components/plate-ui/hr-element'
import { ImageElement } from '@/components/plate-ui/image-element'
import { InlineEquationElement } from '@/components/plate-ui/inline-equation-element'
import { KbdLeaf } from '@/components/plate-ui/kbd-leaf'
import { LinkElement } from '@/components/plate-ui/link-element'
import { MediaAudioElement } from '@/components/plate-ui/media-audio-element'
import { MediaEmbedElement } from '@/components/plate-ui/media-embed-element'
import { MediaFileElement } from '@/components/plate-ui/media-file-element'
import { MediaPlaceholderElement } from '@/components/plate-ui/media-placeholder-element'
import { MediaVideoElement } from '@/components/plate-ui/media-video-element'
import { MentionElement } from '@/components/plate-ui/mention-element'
import { MentionInputElement } from '@/components/plate-ui/mention-input-element'
import { ParagraphElement } from '@/components/plate-ui/paragraph-element'
import { withPlaceholders } from '@/components/plate-ui/placeholder'
import { SlashInputElement } from '@/components/plate-ui/slash-input-element'
import { SuggestionLeaf } from '@/components/plate-ui/suggestion-leaf'
import {
  TableCellElement,
  TableCellHeaderElement,
} from '@/components/plate-ui/table-cell-element'
import { TableElement } from '@/components/plate-ui/table-element'
import { TableRowElement } from '@/components/plate-ui/table-row-element'
import { TocElement } from '@/components/plate-ui/toc-element'
import { ToggleElement } from '@/components/plate-ui/toggle-element'
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
  BidirectionalLinkInputPlugin,
  BidirectionalLinkPlugin,
} from '../custom-plate-plugins/bidirectional-link/react'
import { BidirectionalLinkElement } from '../custom-plate-plugins/bidirectional-link/react/bidirectional-link-element'
import { BidirectionalLinkInputElement } from '../custom-plate-plugins/bidirectional-link/react/bidirectional-link-input-element'
import { CampaignPlugin } from '../custom-plate-plugins/campaign/react'
import { CampaignElement } from '../custom-plate-plugins/campaign/react/campaign-element'
import { CommentBoxPlugin } from '../custom-plate-plugins/comment-box/react'
import { CommentBoxElement } from '../custom-plate-plugins/comment-box/react/comment-box-element'
import { FriendsPlugin } from '../custom-plate-plugins/friends/react'
import { FriendsElement } from '../custom-plate-plugins/friends/react/friends-element'
import { PodcastTimePlugin } from '../custom-plate-plugins/podcast-time/react'
import { ProductPlugin } from '../custom-plate-plugins/product/react'
import { ProductElement } from '../custom-plate-plugins/product/react/product-element'
import { ProjectsPlugin } from '../custom-plate-plugins/projects/react'
import { ProjectsElement } from '../custom-plate-plugins/projects/react/projects-element'
import { SocialLinksPlugin } from '../custom-plate-plugins/social-links/react'
import { SocialLinksElement } from '../custom-plate-plugins/social-links/react/social-links-element'
import { PodcastTimeElement } from '../plate-ui/podcast-time-element'

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
  [BidirectionalLinkPlugin.key]: BidirectionalLinkElement,
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
  return usePlateEditor<Value>(
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
}
