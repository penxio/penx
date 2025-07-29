import { t } from '@lingui/core/macro'
import { produce } from 'immer'
import { localDB } from '@penx/local-db'
import { IStructNode } from '@penx/model-type'
import { ColumnType, StructType } from '@penx/types'
import { uniqueId } from '@penx/unique-id'

// fallback to old data, remove it later
export async function fixTaskStruct(areaId: string, structs: IStructNode[]) {
  const taskStruct = structs.find((s) => s.props.type === StructType.TASK)
  if (taskStruct) {
    const reminderColumn = taskStruct.props.columns.find(
      (c) => c.slug === 'reminder',
    )
    if (!reminderColumn) {
      const newTaskStruct = produce(taskStruct, (draft) => {
        draft.props.columns.push({
          id: uniqueId(),
          slug: 'reminder',
          name: t`Reminder`,
          description: '',
          columnType: ColumnType.DATE,
          config: {},
          options: [],
          isPrimary: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      })

      await localDB.updateStructProps(taskStruct.id, {
        columns: newTaskStruct.props.columns,
      })
      structs = await localDB.listStructs(areaId)
    }
  }

  // if (taskStruct) {
  //   const dateColumn = taskStruct.props.columns.find((c) => c.slug === 'date')
  //   if (!dateColumn) {
  //     const newTaskStruct = produce(taskStruct, (draft) => {
  //       draft.props.columns.push({
  //         id: uniqueId(),
  //         slug: 'date',
  //         name: t`Date`,
  //         description: '',
  //         columnType: ColumnType.DATE,
  //         config: {},
  //         options: [],
  //         isPrimary: false,
  //         createdAt: new Date(),
  //         updatedAt: new Date(),
  //       })
  //     })

  //     await localDB.updateStructProps(taskStruct.id, {
  //       columns: newTaskStruct.props.columns,
  //     })
  //     structs = await localDB.listStructs(areaId)
  //   }
  // }
  {
    if (taskStruct) {
      const listColumn = taskStruct.props.columns.find((c) => c.slug === 'list')
      if (!listColumn) {
        const newTaskStruct = produce(taskStruct, (draft) => {
          draft.props.columns.push({
            id: uniqueId(),
            slug: 'list',
            name: t`List`,
            description: '',
            columnType: ColumnType.SINGLE_SELECT,
            config: {},
            options: [],
            isPrimary: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        })

        await localDB.updateStructProps(taskStruct.id, {
          columns: newTaskStruct.props.columns,
        })
        structs = await localDB.listStructs(areaId)
      }
    }
  }

  return structs
}
