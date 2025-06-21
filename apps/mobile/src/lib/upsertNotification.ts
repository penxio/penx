import { LocalNotifications } from '@capacitor/local-notifications'
import { isDate } from 'date-fns'
import { Creation } from '@penx/domain'
import { IColumn, ICreationNode } from '@penx/model-type'

export const upsertNotification = async (
  column: IColumn,
  raw: ICreationNode,
) => {
  if (!column) return
  const creation = new Creation(raw)
  const value = creation.cells[column.id]
  if (!value) return

  if (!isDate(value?.date)) return
  if (value.date.getTime() <= Date.now()) return

  const pending = await LocalNotifications.getPending()

  const find = pending.notifications.find((n) => {
    return n.extra.taskId === creation.id
  })

  let id = Date.now()

  if (find) {
    await LocalNotifications.cancel({
      notifications: [{ id: find.id }],
    })
    id = find.id
  }

  await LocalNotifications.schedule({
    notifications: [
      {
        id,
        title: 'PenX',
        body: creation.title,
        schedule: { at: value.date },
        sound: 'bell.wav',
        actionTypeId: '',
        extra: {
          taskId: creation.id,
        },
      },
    ],
  })
}
