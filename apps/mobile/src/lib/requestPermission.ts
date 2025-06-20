import { LocalNotifications } from '@capacitor/local-notifications'

export async function requestNotificationPermission() {
  const permission = await LocalNotifications.requestPermissions()
  if (permission.display === 'granted') {
    console.log('Notification permission granted')
  } else {
    console.log('Notification permission denied')
  }
}
