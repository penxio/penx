'use client'

import emojiMartData from '@emoji-mart/data'
import { DocxPlugin } from '@udecode/plate-docx'
import { EmojiPlugin } from '@udecode/plate-emoji/react'
import { JuicePlugin } from '@udecode/plate-juice'
import { MarkdownPlugin } from '@udecode/plate-markdown'
import { SlashPlugin } from '@udecode/plate-slash-command/react'
import { TrailingBlockPlugin } from '@udecode/plate-trailing-block'
import { BaseBidirectionalLinkPlugin } from '@penx/uikit/editor/custom-plate-plugins/bidirectional-link'
import { BidirectionalLinkPlugin } from '@penx/uikit/editor/custom-plate-plugins/bidirectional-link/react'
import { CampaignPlugin } from '@penx/uikit/editor/custom-plate-plugins/campaign/react'
import { CommentBoxPlugin } from '@penx/uikit/editor/custom-plate-plugins/comment-box/react'
import { FriendsPlugin } from '@penx/uikit/editor/custom-plate-plugins/friends/react'
import { PodcastTimePlugin } from '@penx/uikit/editor/custom-plate-plugins/podcast-time/react'
import { ProductPlugin } from '@penx/uikit/editor/custom-plate-plugins/product/react'
import { ProjectsPlugin } from '@penx/uikit/editor/custom-plate-plugins/projects/react'
import { SocialLinksPlugin } from '@penx/uikit/editor/custom-plate-plugins/social-links/react'
import { FloatingToolbarPlugin } from '@penx/uikit/editor/plugins/floating-toolbar-plugin'
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

  // BaseProductPlugin,
  ProductPlugin,
  CommentBoxPlugin,
  FriendsPlugin,
  ProjectsPlugin,
  SocialLinksPlugin,
  CampaignPlugin,
  PodcastTimePlugin,
  BidirectionalLinkPlugin,
] as any
