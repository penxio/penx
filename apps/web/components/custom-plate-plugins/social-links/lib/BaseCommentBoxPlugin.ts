import { bindFirst, createSlatePlugin, type TElement } from '@udecode/plate'
import { insertSocialLinks } from './transforms'

export interface TSocialLinksElement extends TElement {
  creationId?: string
}

export const BaseSocialLinksPlugin = createSlatePlugin({
  key: 'social-links',
  node: { isElement: true },
}).extendEditorTransforms(({ editor }) => ({
  insert: { callout: bindFirst(insertSocialLinks, editor) },
}))
