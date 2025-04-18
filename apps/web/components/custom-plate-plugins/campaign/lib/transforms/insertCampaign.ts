import type { InsertNodesOptions, SlateEditor } from '@udecode/plate'
import {
  BaseCampaignPlugin,
  type TCampaignElement,
} from '../BaseCampaignPlugin'

export const insertCampaign = (
  editor: SlateEditor,
  {
    ...options
  }: InsertNodesOptions & {
    icon?: string
    variant?: (string & {}) | TCampaignElement['variant']
  } = {},
) => {
  editor.tf.insertNodes<TCampaignElement>(
    {
      children: [{ text: '' }],
      campaignId: '',
      type: editor.getType(BaseCampaignPlugin),
    },
    options as any,
  )
}
