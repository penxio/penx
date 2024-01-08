import { Editor } from 'slate'
import type { AutoformatRule } from '@penx/autoformat'
import { PenxEditor } from '@penx/editor-common'
import { BlockElement, OnBlur, OnKeyDown } from '@penx/extension-typings'
import { ExtensionStore as ExtensionStoreJSON } from '@penx/store'

export class ExtensionStore {
  private static instance: ExtensionStore

  rules: AutoformatRule[] = []

  withFns: ((editor: PenxEditor) => Editor)[] = []

  elementMaps: Record<string, BlockElement> = {}

  onKeyDownFns: OnKeyDown[] = []

  onBlurFns: OnBlur[] = []

  inlineTypes: string[] = []

  voidTypes: string[] = []

  constructor(public store: ExtensionStoreJSON) {
    this.init()
  }

  public static getInstance(store: ExtensionStoreJSON): ExtensionStore {
    if (!ExtensionStore.instance) {
      ExtensionStore.instance = new ExtensionStore(store)
    }
    return ExtensionStore.instance
  }

  private init() {
    // builtin plugins
    const {
      store,
      withFns,
      rules,
      elementMaps,
      onKeyDownFns,
      onBlurFns,
      inlineTypes,
      voidTypes,
    } = this

    // penx plugins
    for (const name of Object.keys(store)) {
      const plugin = store[name]
      if (!plugin.block) continue
      const { elements = [] } = plugin.block
      if (plugin.block?.with) {
        if (Array.isArray(plugin.block.with)) {
          withFns.push(...plugin.block.with)
        } else {
          withFns.push(plugin.block.with)
        }
      }

      if (plugin.block.handlers?.onKeyDown) {
        onKeyDownFns.push(plugin.block.handlers.onKeyDown)
      }

      if (plugin.block.handlers?.onBlur) {
        onBlurFns.push(plugin.block.handlers.onBlur)
      }

      if (plugin.block.autoformatRules) {
        this.rules = [...this.rules, ...plugin.block.autoformatRules]
      }

      for (const ele of elements) {
        // get inline types
        if (isBooleanTrue(ele.isInline)) inlineTypes.push(ele.type)

        // get void types
        if (isBooleanTrue(ele.isVoid)) voidTypes.push(ele.type)

        // set element maps
        elementMaps[ele.type] = ele
      }
    }

    return { withFns, rules }
  }
}

function isBooleanTrue(value: any): value is true {
  return typeof value === 'boolean' && value === true
}
