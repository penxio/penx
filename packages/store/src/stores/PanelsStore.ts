import isEqual from 'react-fast-compare'
import { format } from 'date-fns'
import { get, set } from 'idb-keyval'
import { produce } from 'immer'
import { atom } from 'jotai'
import { WidgetType } from '@penx/constants'
import { localDB } from '@penx/local-db'
import { NodeType } from '@penx/model-type'
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
    const area = this.store.area.get()
    const key = `${PANELS}_${area.id}`
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

  async updateJournalPanel(date: string) {
    let panels = this.get()
    const newPanels = produce(panels, (draft) => {
      for (const panel of panels) {
        if (panel.type === PanelType.JOURNAL) {
          panel.date = date
        }
      }
    })
    await this.savePanels(newPanels)
  }

  async updateMainPanel(panel: Partial<Panel>) {
    let panels = this.get()
    let len = panels.length

    let index = panels.findIndex((p) => p.type !== PanelType.WIDGET)
    if (index < 0) index = panels.length - 1

    let journalIndex = panels.findIndex((p) => p.type === PanelType.JOURNAL)

    if (journalIndex > -1) {
      index = journalIndex + 1
    }

    if (panel.type === PanelType.CREATION) {
      panels = produce(panels, (draft) => {
        const len = index > draft.length ? draft.length + 1 : index
        const size = 100 / len

        draft[index] = {
          id: uniqueId(),
          ...panel,
          size: size,
        } as Panel
        draft[index].isLoading = true
      })
      await this.savePanels(panels)
    }

    setTimeout(async () => {
      const newPanels = produce(panels, (draft) => {
        const len = index > draft.length ? draft.length + 1 : index
        const size = 100 / len

        draft[index] = {
          id: uniqueId(),
          ...panel,
          size: size,
        } as Panel
        draft[index].isLoading = false
      })

      await this.savePanels(newPanels)
    }, 1)
  }

  async openJournal(date: Date = new Date()) {
    let panels = this.get()
    const panel: Panel = {
      id: uniqueId(),
      type: PanelType.JOURNAL,
      date: format(date, 'yyyy-MM-dd'),
    }

    panels = produce(panels, (draft) => {
      draft[0] = panel
    })
    await this.savePanels(panels)
  }

  async openWidgetPanel(widget: Widget, isNewPanel = false) {
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
        const hasStruct = panels.some(
          (p) => p.type === PanelType.WIDGET && !!p.widget?.structId,
        )

        if (isNewPanel) {
          if (hasStruct) {
            const size = 100 / draft.length
            draft[draft.length - 1] = {
              id: uniqueId(),
              type: PanelType.WIDGET,
              widget,
              size: size,
            }
          } else {
            draft.push({
              id: uniqueId(),
              type: PanelType.WIDGET,
              widget,
              size: size,
            })
          }
        } else {
          const size = 100 / draft.length
          draft[0] = {
            id: uniqueId(),
            type: PanelType.WIDGET,
            widget,
            size: size,
          }
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
      return this.resetPanels()
    }
    await this.savePanels(newPanels)
  }

  async resetPanels() {
    const area = this.store.area.get()
    const date = new Date()
    const dateStr = format(date, 'yyyy-MM-dd')

    const journals = await localDB.listJournals(area.id)
    let journal = journals.find(
      (n) => n.type === NodeType.JOURNAL && n.props.date === dateStr,
    )!

    if (!journal) {
      journal = {
        id: uniqueId(),
        type: NodeType.JOURNAL,
        props: {
          date: dateStr,
          children: [],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        siteId: area.siteId,
        userId: area.userId,
        areaId: area.id,
      }

      await localDB.addJournal(journal)
    }

    const defaultPanels = [
      {
        id: uniqueId(),
        type: PanelType.JOURNAL,
        date: dateStr,
      } as Panel,
    ]

    await this.savePanels(defaultPanels)
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
