/// <reference types="@capacitor/keyboard" />
import { CapacitorConfig } from '@capacitor/cli'
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard'

const config: CapacitorConfig = {
  appId: 'com.penx.penxio',
  appName: 'PenX',
  webDir: 'out',
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
    Keyboard: {
      resize: KeyboardResize.Body,
      // style: KeyboardStyle.Dark,
      resizeOnFullScreen: true,
    },
  },
}

export default config
