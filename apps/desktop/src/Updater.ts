import { useEffect, useRef } from 'react'
import { ask, confirm } from '@tauri-apps/plugin-dialog'
import { relaunch } from '@tauri-apps/plugin-process'
import { check } from '@tauri-apps/plugin-updater'
import { toast } from 'sonner'

async function checkUpdateAndInstall({ beta }: { beta?: boolean } = {}) {
  const update = await check()
  console.log('========update123567:', update)

  if (update) {
    const confirmation = await confirm(
      `A new version ${update.version} is available. Do you want to install and relaunch?`,
      { title: 'PenX', kind: 'info' },
    )

    if (confirmation) {
      await update.downloadAndInstall()
      console.log('=========downloadAndInstall successfully')
      await relaunch()
    }
  } else {
    // toast.info('You are on the latest version')
  }
}

export function Updater() {
  const inited = useRef(false)
  useEffect(() => {
    if (inited.current) return
    inited.current = true
    setTimeout(() => {
      checkUpdateAndInstall()
      console.log('========updater start....')
    }, 5000)
  }, [])
  return null
}
