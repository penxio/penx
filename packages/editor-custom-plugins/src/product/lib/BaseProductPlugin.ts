import { bindFirst, createSlatePlugin, type TElement } from '@udecode/plate'
import { insertProduct } from './transforms'

export interface TProductElement extends TElement {
  productId?: string
}

export const BaseProductPlugin = createSlatePlugin({
  key: 'product',
  node: { isElement: true },
}).extendEditorTransforms(({ editor }) => ({
  insert: { callout: bindFirst(insertProduct, editor) },
}))
