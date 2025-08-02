import { relaunch } from '@tauri-apps/plugin-process'
import { check } from '@tauri-apps/plugin-updater'
import { toast } from 'sonner'

export async function checkUpdateAndInstall({ beta }: { beta?: boolean } = {}) {
  const update = await check({
    headers: {
      'kk-updater-mode': beta ? 'beta' : 'stable',
    },
  })
  if (update?.available) {
    const confirmUpdate = await confirm(
      `A new version ${update.version} is available. Do you want to install and relaunch?`,
    )
    if (confirmUpdate) {
      await update.downloadAndInstall()
      await relaunch()
    }
  } else {
    toast.info('You are on the latest version')
  }
}
