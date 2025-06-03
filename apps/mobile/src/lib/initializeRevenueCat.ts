import { Capacitor } from '@capacitor/core'
import { LOG_LEVEL, Purchases } from '@revenuecat/purchases-capacitor'

export async function initializeRevenueCat() {
  try {
    await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG })

    if (Capacitor.getPlatform() === 'ios') {
      // await Purchases.configure({
      //   apiKey: 'appl_CioLamReqEDMuGMBQXyHhPjELYv',
      // })
    }

    console.log('RevenueCat inited')
  } catch (error) {
    console.error('RevenueCat init fail:', error)
  }
}
