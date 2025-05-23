import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'io.penx.app',
  appName: 'PenX',
  webDir: 'dist',

  plugins: {
    SplashScreen: {
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      backgroundColor: '#ffffffff',
      showSpinner: false,
    },

    Keyboard: {
      resize: 'none',
      resizeOnFullScreen: true,
    },
  },
}

export default config
