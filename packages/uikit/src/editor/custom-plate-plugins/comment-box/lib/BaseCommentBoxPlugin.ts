import { bindFirst, createSlatePlugin, type TElement } from '@udecode/plate'
import { insertCommentBox } from './transforms'

export interface TCommentBoxElement extends TElement {
  creationId?: string
}

export const BaseCommentBoxPlugin = createSlatePlugin({
  key: 'comment-box',
  node: { isElement: true },
}).extendEditorTransforms(({ editor }) => ({
  insert: { callout: bindFirst(insertCommentBox, editor) },
}))
