import { BlockDiscussion } from '@penx/editor-plugins/plate-ui/block-discussion'
import { SuggestionBelowNodes } from '@penx/editor-plugins/plate-ui/suggestion-line-break'
import { CalloutPlugin } from '@udecode/plate-callout/react'
import { DatePlugin } from '@udecode/plate-date/react'
import {
  FontBackgroundColorPlugin,
  FontColorPlugin,
  FontSizePlugin,
} from '@udecode/plate-font/react'
import { HighlightPlugin } from '@udecode/plate-highlight/react'
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react'
import { KbdPlugin } from '@udecode/plate-kbd/react'
import { ColumnPlugin } from '@udecode/plate-layout/react'
import { TogglePlugin } from '@udecode/plate-toggle/react'
import { alignPlugin } from './align-plugin'
import { basicNodesPlugins } from './basic-nodes-plugins'
import { commentsPlugin } from './comments-plugin'
import { equationPlugins } from './equation-plugins'
import { indentListPlugins } from './indent-list-plugins'
import { lineHeightPlugin } from './line-height-plugin'
import { linkPlugin } from './link-plugin'
import { mediaPlugins } from './media-plugins'
import { mentionPlugin } from './mention-plugin'
import { skipMarkPlugin } from './skip-mark-plugin'
import { suggestionPlugin } from './suggestion-plugin'
import { tablePlugin } from './table-plugin'
import { tocPlugin } from './toc-plugin'

export const viewPlugins = [
  ...basicNodesPlugins,
  HorizontalRulePlugin,
  linkPlugin,
  DatePlugin,
  mentionPlugin,
  tablePlugin,
  TogglePlugin,
  tocPlugin,
  ...mediaPlugins,
  ...equationPlugins,
  CalloutPlugin,
  ColumnPlugin,

  // Marks
  FontColorPlugin,
  FontBackgroundColorPlugin,
  FontSizePlugin,
  HighlightPlugin,
  KbdPlugin,
  skipMarkPlugin,

  // Block Style
  alignPlugin,
  ...indentListPlugins,
  lineHeightPlugin,

  // Collaboration
  commentsPlugin.configure({
    render: { aboveNodes: BlockDiscussion as any },
  }),
  suggestionPlugin.configure({
    render: { belowNodes: SuggestionBelowNodes as any },
  }),
] as const
