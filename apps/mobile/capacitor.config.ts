import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'io.penx.app',
  appName: 'PenX',
  webDir: 'dist',

  plugins: {
    Keyboard: {
      resize: 'none',
      // resize: 'ionic',
    },
  },
}

export default config
