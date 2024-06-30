import { notification } from '@penxio/api'

export async function main() {
  const granted = await notification.isPermissionGranted()
  console.log('=======granted:', granted)
  if (granted) {
    notification.sendNotification('Hello from Penx')
  }
}
