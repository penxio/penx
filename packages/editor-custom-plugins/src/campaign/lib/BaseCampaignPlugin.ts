import { bindFirst, createSlatePlugin, type TElement } from '@udecode/plate'
import { insertCampaign } from './transforms'

export interface TCampaignElement extends TElement {
  campaignId?: string
}

export const BaseCampaignPlugin = createSlatePlugin({
  key: 'campaign',
  node: { isElement: true },
}).extendEditorTransforms(({ editor }) => ({
  insert: { callout: bindFirst(insertCampaign, editor) },
}))
