import { Capacitor } from '@capacitor/core'
import {
  LocalNotifications,
  PermissionStatus,
  SettingsPermissionStatus,
} from '@capacitor/local-notifications'

export async function checkAndRequestNotificationPermissions(): Promise<boolean> {
  try {
    // First, check the current notification permission status
    let permStatus: PermissionStatus =
      await LocalNotifications.checkPermissions()

    // If permission is not granted, request permission (Android 13+ will show a prompt)
    if (permStatus.display !== 'granted') {
      permStatus = await LocalNotifications.requestPermissions()
    }

    if (permStatus.display !== 'granted') {
      console.warn('User has not granted notification permission')
      return false
    }

    // For Android 12+, check if exact alarm permission is granted
    if (Capacitor.getPlatform() === 'android') {
      const exactAlarmStatus: SettingsPermissionStatus =
        await LocalNotifications.checkExactNotificationSetting()
      if (exactAlarmStatus.exact_alarm !== 'granted') {
        console.warn(
          'Exact notification permission is not enabled, notifications may be inaccurate',
        )
        // Optionally, request the user to enable exact notification permission
        try {
          const changeStatus =
            await LocalNotifications.changeExactNotificationSetting()
          if (changeStatus.exact_alarm !== 'granted') {
            console.warn('User denied enabling exact notification permission')
          } else {
            console.log('User enabled exact notification permission')
          }
        } catch (error) {
          console.error(
            'Failed to request enabling exact notification permission',
            error,
          )
        }
      } else {
        console.log('Exact notification permission is enabled')
      }
    }

    return true
  } catch (error) {
    console.error('Error checking notification permissions', error)
    return false
  }
}

// Call this on app launch or app state change to keep permission status updated
// App.addListener('appStateChange', async (state) => {
//   if (state.isActive) {
//     const hasPermission = await checkAndRequestNotificationPermissions()
//     console.log(
//       'Notification permission status:',
//       hasPermission ? 'Enabled' : 'Disabled',
//     )
//   }
// })
