import { bindFirst, createSlatePlugin, TElement } from '@udecode/plate'
import { insertPodcastTime } from './transforms'

export interface TPodcastTimeElement extends TElement {
  point: string
}

export const BasePodcastTimePlugin = createSlatePlugin({
  key: 'podcast_time',
  node: { isElement: true, isInline: true, isVoid: true },
}).extendEditorTransforms(({ editor }) => ({
  insert: {
    podcastTime: bindFirst(insertPodcastTime, editor),
  },
}))
