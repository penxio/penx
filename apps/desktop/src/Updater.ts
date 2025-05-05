import { useEffect, useRef } from 'react'
import { relaunch } from '@tauri-apps/plugin-process'
import { check } from '@tauri-apps/plugin-updater'
import { toast } from 'sonner'

async function checkUpdateAndInstall({ beta }: { beta?: boolean } = {}) {
  const update = await check()
  console.log('========update:', update)

  if (update) {
    const confirmUpdate = confirm(
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
