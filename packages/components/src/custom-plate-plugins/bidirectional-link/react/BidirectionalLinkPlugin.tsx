import { toPlatePlugin } from '@udecode/plate/react'
import {
  BaseBidirectionalLinkInputPlugin,
  BaseBidirectionalLinkPlugin,
} from '../lib'

export const BidirectionalLinkPlugin = toPlatePlugin(
  BaseBidirectionalLinkPlugin,
)

export const BidirectionalLinkInputPlugin = toPlatePlugin(
  BaseBidirectionalLinkInputPlugin,
)
