import { LocalNotifications } from '@capacitor/local-notifications'
import { Creation, Struct } from '@penx/domain'
import { ICreationNode } from '@penx/model-type'

export const removeNotification = async (raw: ICreationNode) => {
  const creation = new Creation(raw)
  const pending = await LocalNotifications.getPending()

  const find = pending.notifications.find((n) => {
    return n.extra.taskId === creation.id
  })

  if (find) {
    await LocalNotifications.cancel({
      notifications: [{ id: find.id }],
    })
  }
}
