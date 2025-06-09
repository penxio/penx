import { produce } from 'immer'
import { atom } from 'jotai'
import { Struct } from '@penx/domain'
import { getRandomColorName } from '@penx/libs/color-helper'
import { generateStructNode } from '@penx/libs/getDefaultStructs'
import { localDB } from '@penx/local-db'
import { IColumn, IStructNode } from '@penx/model-type'
import { ColumnType, Option } from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { StoreType } from '../store-types'

export const structsAtom = atom<IStructNode[]>([])

export type InstallStructInput = {
  id: string
  name: string
  pluralName?: string
  description?: string
  type?: string
  color?: string
  about?: string
  columns: IColumn[]
}

export type AddColumnInput = {
  columnType: ColumnType
  name?: string
  description?: string
}

export class StructsStore {
  constructor(private store: StoreType) {}

  get() {
    return this.store.get(structsAtom)
  }

  set(state: IStructNode[]) {
    this.store.set(structsAtom, state)
  }

  createStruct(name: string) {
    const site = this.store.site.get()
    const area = this.store.area.get()
    const structs = this.get()
    const newStruct = generateStructNode({
      type: name.toUpperCase(),
      name,
      areaId: area.id,
      siteId: site.id,
      userId: site.userId,
    })

    const newStructs = produce(structs, (draft) => {
      draft.push(newStruct)
    })

    this.set(newStructs)
    localDB.addStruct(newStruct)
  }

  installStruct(input: InstallStructInput) {
    const site = this.store.site.get()
    const structs = this.get()
    const area = this.store.area.get()
    const newStruct = generateStructNode({
      ...input,
      areaId: area.id,
      siteId: site.id,
      userId: site.userId,
    })

    const newStructs = produce(structs, (draft) => {
      draft.push(newStruct)
    })

    this.set(newStructs)
    localDB.addStruct(newStruct)
  }

  async deleteStruct(id: string) {
    await localDB.deleteStruct(id)
    const panels = this.store.panels.get()
    const panel = panels.find((p) => p.widget?.structId === id)
    if (panel) this.store.panels.closePanel(panel.id)
    await this.refetchStructs()
  }

  updateStruct(id: string, newStruct: IStructNode) {
    const structs = this.get()
    const newStructs = produce(structs, (draft) => {
      const index = draft.findIndex((s) => s.id === id)
      draft[index] = newStruct
    })
    this.set(newStructs)
  }

  async updateStructProps(
    struct: Struct,
    props: Partial<IStructNode['props']>,
  ) {
    const newStruct = produce(struct.raw, (draft) => {
      draft.props = {
        ...draft.props,
        ...props,
      }
    })

    this.updateStruct(struct.id, newStruct)
    await localDB.updateStructProps(struct.id, props)
  }

  async addOption(struct: Struct, columnId: string, data: Partial<Option>) {
    const id = uniqueId()
    const newOption = {
      id,
      color: getRandomColorName(),
      isDefault: false,
      ...data,
    } as Option

    const newStruct = produce(struct.raw, (draft) => {
      for (const column of draft.props.columns) {
        if (column.id === columnId) {
          column.options = [...column.options, newOption]
          break
        }
      }
    })

    this.updateStruct(struct.id, newStruct)

    localDB.updateStructProps(struct.id, {
      columns: newStruct.props.columns,
    })

    return {
      newOption,
      newColumns: newStruct.props.columns,
    }
  }

  async refetchStructs(areaId?: string) {
    const area = this.store.area.get()
    const structs = await localDB.listStructs(areaId || area.id)
    this.set(structs)
    return structs
  }

  async addColumn(struct: Struct, input: AddColumnInput) {
    const { columnType } = input
    const nameMap: Record<string, string> = {
      [ColumnType.TEXT]: 'Text',
      [ColumnType.NUMBER]: 'Number',
      [ColumnType.URL]: 'URL',
      [ColumnType.PASSWORD]: 'Password',
      [ColumnType.SINGLE_SELECT]: 'Single Select',
      [ColumnType.MULTIPLE_SELECT]: 'Multiple Select',
      [ColumnType.RATE]: 'Rate',
      [ColumnType.IMAGE]: 'Image',
      [ColumnType.MARKDOWN]: 'Markdown',
      [ColumnType.DATE]: 'Date',
      [ColumnType.CREATED_AT]: 'Created At',
      [ColumnType.UPDATED_AT]: 'Updated At',
    }
    const id = uniqueId()
    const slug = uniqueId()
    const name = input.name || nameMap[columnType] || ''
    const newStruct = produce(struct.raw, (draft) => {
      draft.props.columns.push({
        id,
        isPrimary: false,
        name,
        slug,
        description: input.description || '',
        config: {},
        options: [],
        columnType,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      for (const view of draft.props.views) {
        view.viewColumns.push({
          columnId: id,
          width: 160,
          visible: true,
        })
      }
    })

    const creations = this.store.creations.get()

    const newCreations = produce(creations, (draft) => {
      for (const item of draft) {
        if (item.props.structId !== struct.id) continue
        item.props.cells[id] = ''
      }
    })

    this.updateStruct(struct.id, newStruct)
    this.store.creations.set(newCreations)

    await localDB.updateStructProps(struct.id, {
      columns: newStruct.props.columns,
      views: newStruct.props.views,
    })

    const records = creations.filter(
      (creation) => creation.props.structId === struct.id,
    )

    for (const item of records) {
      const newProps = produce(item.props, (draft) => {
        draft.cells[id] = ''
      })
      await localDB.updateCreationProps(item.id, {
        cells: newProps.cells,
      })
    }
  }

  async deleteColumn(struct: Struct, columnId: string) {
    const newStruct = produce(struct.raw, (draft) => {
      draft.props.columns = draft.props.columns.filter(
        (column) => column.id !== columnId,
      )

      for (const view of draft.props.views) {
        view.viewColumns = view.viewColumns.filter(
          (i) => i.columnId !== columnId,
        )
      }
    })

    const creations = this.store.creations.get()
    const newCreations = produce(creations, (draft) => {
      for (const item of draft) {
        if (item.props.structId !== struct.id) continue
        delete item.props.cells[columnId]
      }
    })

    this.store.creations.set(newCreations)
    this.store.structs.updateStruct(struct.id, newStruct)

    await localDB.updateStructProps(struct.id, {
      columns: newStruct.props.columns,
      views: newStruct.props.views,
    })

    const records = creations.filter(
      (creation) => creation.props.structId === struct.id,
    )

    for (const item of records) {
      const newProps = produce(item.props, (draft) => {
        delete draft.cells[columnId]
      })
      await localDB.updateCreationProps(item.id, {
        cells: newProps.cells,
      })
    }
  }

  async updateColumnName(struct: Struct, columnId: string, name: string) {
    const newStruct = produce(struct.raw, (draft) => {
      for (const column of draft.props.columns) {
        if (column.id === columnId) {
          column.name = name
          break
        }
      }
    })

    this.updateStruct(struct.id, newStruct)

    await localDB.updateStructProps(struct.id, {
      columns: newStruct.props.columns,
    })
  }

  async updateColumn(struct: Struct, columnId: string, data: Partial<IColumn>) {
    const newStruct = produce(struct.raw, (draft) => {
      const index = draft.props.columns.findIndex((c) => c.id === columnId)
      draft.props.columns[index] = { ...draft.props.columns[index], ...data }
    })

    this.updateStruct(struct.id, newStruct)

    await localDB.updateStructProps(struct.id, {
      columns: newStruct.props.columns,
    })
  }

  async updateOption(
    struct: Struct,
    columnId: string,
    optionId: string,
    data: Partial<Option>,
  ) {
    const newColumns = produce(struct.columns, (draft) => {
      for (const column of draft) {
        if (column.id !== columnId) continue
        if (!column.options) column.options = []
        const optionIndex = column.options.findIndex((o) => o.id === optionId)

        column.options[optionIndex] = {
          ...column.options[optionIndex],
          ...data,
        }
      }
    })

    this.updateStructProps(struct, {
      columns: newColumns,
    })
    return newColumns
  }

  async deleteOption(struct: Struct, columnId: string, optionId: string) {
    const newColumns = produce(struct.columns, (draft) => {
      for (const column of draft) {
        if (column.id !== columnId) continue
        column.options = column.options.filter((o) => o.id !== optionId)
      }
    })

    this.updateStructProps(struct, {
      columns: newColumns,
    })
    return newColumns
  }
}
