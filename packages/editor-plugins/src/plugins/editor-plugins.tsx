'use client'

import emojiMartData from '@emoji-mart/data'
import { DocxPlugin } from '@udecode/plate-docx'
import { EmojiPlugin } from '@udecode/plate-emoji/react'
import { JuicePlugin } from '@udecode/plate-juice'
import { MarkdownPlugin } from '@udecode/plate-markdown'
import { SlashPlugin } from '@udecode/plate-slash-command/react'
import { TrailingBlockPlugin } from '@udecode/plate-trailing-block'
import {
  BaseBidirectionalLinkPlugin,
  BaseProductPlugin,
  BidirectionalLinkPlugin,
  CampaignPlugin,
  CommentBoxPlugin,
  FriendsPlugin,
  PodcastTimePlugin,
  ProductPlugin,
  ProjectsPlugin,
  SocialLinksPlugin,
} from '@penx/editor-custom-plugins'
import { FloatingToolbarPlugin } from '@penx/editor-plugins/plugins/floating-toolbar-plugin'
import { aiPlugins } from './ai-plugins'
import { autoformatPlugin } from './autoformat-plugin'
import { blockMenuPlugins } from './block-menu-plugins'
import { cursorOverlayPlugin } from './cursor-overlay-plugin'
import { deletePlugins } from './delete-plugins'
import { dndPlugins } from './dnd-plugins'
import { exitBreakPlugin } from './exit-break-plugin'
import { resetBlockTypePlugin } from './reset-block-type-plugin'
import { softBreakPlugin } from './soft-break-plugin'
import { viewPlugins } from './views-plugins'

export const editorPlugins = [
  // AI
  ...aiPlugins,

  // Nodes
  ...viewPlugins,

  // Functionality
  SlashPlugin,
  autoformatPlugin,
  cursorOverlayPlugin,
  ...blockMenuPlugins,
  ...dndPlugins,
  EmojiPlugin.configure({ options: { data: emojiMartData as any } }),
  exitBreakPlugin,
  resetBlockTypePlugin,
  ...deletePlugins,
  softBreakPlugin,
  TrailingBlockPlugin,

  // Deserialization
  DocxPlugin,
  MarkdownPlugin.configure({ options: { indentList: true } }),
  JuicePlugin,

  // UI
  // FixedToolbarPlugin,
  FloatingToolbarPlugin,

  BaseProductPlugin,
  BaseBidirectionalLinkPlugin,
  ProductPlugin,
  CommentBoxPlugin,
  FriendsPlugin,
  ProjectsPlugin,
  SocialLinksPlugin,
  CampaignPlugin,
  PodcastTimePlugin,
  BidirectionalLinkPlugin,
]
