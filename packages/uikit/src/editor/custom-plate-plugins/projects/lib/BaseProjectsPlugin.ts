import { bindFirst, createSlatePlugin, type TElement } from '@udecode/plate'
import { insertProjects } from './transforms'

export interface TProjectsElement extends TElement {}

export const BaseProjectsPlugin = createSlatePlugin({
  key: 'projects',
  node: { isElement: true },
}).extendEditorTransforms(({ editor }) => ({
  insert: { callout: bindFirst(insertProjects, editor) },
}))
