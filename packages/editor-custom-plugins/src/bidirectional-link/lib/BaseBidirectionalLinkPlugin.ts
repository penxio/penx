import {
  createSlatePlugin,
  createTSlatePlugin,
  type PluginConfig,
} from '@udecode/plate'
import { TriggerComboboxPluginOptions, withTriggerCombobox } from './combobox'
import type { TBidirectionalLinkElement } from './types'

export type BidirectionalLink = PluginConfig<
  'bidirectional_link',
  {
    insertSpaceAfterMention?: boolean
  } & TriggerComboboxPluginOptions,
  {},
  {
    insert: {
      mention: (options: { search: string; creationId: string }) => void
    }
  }
>

export const BaseBidirectionalLinkInputPlugin = createSlatePlugin({
  key: 'bidirectional_link_input',
  node: { isElement: true, isInline: true, isVoid: true },
})

/** Enables support for autocompleting @mentions. */
export const BaseBidirectionalLinkPlugin =
  createTSlatePlugin<BidirectionalLink>({
    key: 'bidirectional_link',
    node: {
      isElement: true,
      isInline: true,
      isMarkableVoid: true,
      isVoid: true,
    },
    options: {
      trigger: '[[',
      triggerPreviousCharPattern: /^.*?$/,
      createComboboxInput: (trigger) => ({
        children: [{ text: '' }],
        trigger,
        type: BaseBidirectionalLinkInputPlugin.key,
      }),
    },
    plugins: [BaseBidirectionalLinkInputPlugin],
  })
    .extendEditorTransforms<BidirectionalLink['transforms']>(
      ({ editor, type }) => ({
        insert: {
          mention: ({ creationId }) => {
            editor.tf.insertNodes<TBidirectionalLinkElement>({
              creationId,
              children: [{ text: '' }],
              type,
            })
          },
        },
      }),
    )
    .overrideEditor(withTriggerCombobox as any)
