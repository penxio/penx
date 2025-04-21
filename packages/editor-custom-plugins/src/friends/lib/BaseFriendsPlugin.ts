import { bindFirst, createSlatePlugin, type TElement } from '@udecode/plate'
import { insertFriends } from './transforms'

export interface TFriendsElement extends TElement {}

export const BaseFriendsPlugin = createSlatePlugin({
  key: 'friends',
  node: { isElement: true },
}).extendEditorTransforms(({ editor }) => ({
  insert: { callout: bindFirst(insertFriends, editor) },
}))
