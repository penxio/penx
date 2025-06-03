import { Capacitor } from '@capacitor/core'

const platform = Capacitor.getPlatform()

export const isIOS = platform === 'ios'
export const isAndroid = platform === 'android'
export const isMobile = platform === 'ios' || platform === 'android'
