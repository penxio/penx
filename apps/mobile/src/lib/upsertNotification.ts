import { LocalNotifications } from '@capacitor/local-notifications'
import { Creation, Struct } from '@penx/domain'
import { ICreationNode } from '@penx/model-type'

export const upsertNotification = async (
  struct: Struct,
  raw: ICreationNode,
) => {
  const reminderColumn = struct.columns.find((c) => c.slug === 'reminder')

  if (!reminderColumn) return
  const creation = new Creation(raw)
  const value = creation.cells[reminderColumn.id]
  if (!value) return

  if (!(value instanceof Date)) return
  if (value.getTime() <= Date.now()) return

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
        schedule: { at: value },
        sound: 'bell.wav',
        actionTypeId: '',
        extra: {
          taskId: creation.id,
        },
      },
    ],
  })
}
