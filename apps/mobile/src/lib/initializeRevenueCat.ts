import { Capacitor } from '@capacitor/core'
import { LOG_LEVEL, Purchases } from '@revenuecat/purchases-capacitor'

export async function initializeRevenueCat(userId: string) {
  try {
    await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG })

    if (Capacitor.getPlatform() === 'ios') {
      console.log('>>>>>>>>>>>>>>>>>init revenueCat for iOS userId:', userId)

      await Purchases.configure({
        apiKey: 'appl_CioLamReqEDMuGMBQXyHhPjELYv',
        appUserID: userId,
      })
    }

    console.log('RevenueCat inited')
  } catch (error) {
    console.error('RevenueCat init fail:', error)
  }
}
