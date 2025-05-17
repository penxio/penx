import isEqual from 'react-fast-compare'
import { get, set } from 'idb-keyval'
import { produce } from 'immer'
import { atom } from 'jotai'
import { WidgetType } from '@penx/constants'
import { Panel, PanelType, Widget } from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { StoreType } from '../store-types'

const PANELS = 'PANELS'

export const panelsAtom = atom<Panel[]>([])

export class PanelsStore {
  constructor(private store: StoreType) {}

  get() {
    return this.store.get(panelsAtom)
  }

  set(state: Panel[]) {
    this.store.set(panelsAtom, state)
  }

  async savePanels(newPanels: Panel[]) {
    const site = this.store.site.get()
    const key = `${PANELS}_${site.id}`
    this.set(newPanels)
    await set(key, newPanels)
  }

  async addPanel(panel: Partial<Panel>) {
    let panels = this.get()
    const hasAIProviderPanel = panels.some(
      (p) => p.type === PanelType.AI_PROVIDERS,
    )

    if (hasAIProviderPanel && panel.type === PanelType.AI_PROVIDERS) return

    const newPanel = { id: uniqueId(), ...panel } as Panel
    const newPanels = produce(panels, (draft) => {
      draft.push(newPanel)
      const size = 100 / draft.length
      for (const item of draft) {
        item.size = size
      }
    })
    await this.savePanels(newPanels)
  }

  async openPanel(index: number, panel: Panel) {
    let panels = this.get()
    const newPanels = produce(panels, (draft) => {
      draft[index] = panel
    })
    await this.savePanels(newPanels)
  }

  async updateMainPanel(panel: Partial<Panel>) {
    let panels = this.get()

    let index = panels.findIndex((p) => p.type !== PanelType.WIDGET)
    if (index < 0) index = panels.length - 1

    if (panel.type === PanelType.CREATION) {
      panels = produce(panels, (draft) => {
        draft[index] = {
          id: uniqueId(),
          ...panel,
        } as Panel
        draft[index].isLoading = true
      })
      await this.savePanels(panels)
    }

    setTimeout(async () => {
      const newPanels = produce(panels, (draft) => {
        draft[index] = {
          id: uniqueId(),
          ...panel,
        } as Panel
        draft[index].isLoading = false
      })

      await this.savePanels(newPanels)
    }, 1)
  }

  async openWidgetPanel(widget: Widget) {
    let panels = this.get()
    const newPanels = produce(panels, (draft) => {
      const size = 100 / (draft.length + 1)
      for (const item of draft) {
        item.size = size
      }
      if (widget.type === WidgetType.AI_CHAT) {
        draft.push({
          id: uniqueId(),
          type: PanelType.WIDGET,
          widget,
          size: size,
        })
      } else {
        const size = 100 / draft.length
        draft[0] = {
          id: uniqueId(),
          type: PanelType.WIDGET,
          widget,
          size: size,
        }

        // draft.unshift({
        //   id: uniqueId(),
        //   type: PanelType.WIDGET,
        //   widget,
        //   size: size,
        // })
      }
    })
    await this.savePanels(newPanels)
  }

  async closePanel(id: string) {
    let panels = this.get()
    const newPanels = panels.filter((p) => p.id !== id)
    if (!newPanels.length) {
      newPanels.push({
        id: uniqueId(),
        type: PanelType.HOME,
      })
    }
    await this.savePanels(newPanels)
  }

  async resetPanels() {
    await this.savePanels([
      {
        id: uniqueId(),
        type: PanelType.HOME,
      },
    ])
  }

  async updatePanelSizes(sizes: number[]) {
    let panels = this.get()
    if (sizes.length !== panels.length) return
    const oldSizes = panels.map((p) => p.size)
    if (isEqual(oldSizes, sizes)) {
      return
    }

    const newPanels = produce(panels, (draft) => {
      sizes.forEach((size, index) => {
        draft[index].size = size
      })
    })

    await this.savePanels(newPanels)
  }
}
