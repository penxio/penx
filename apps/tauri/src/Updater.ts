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

    console.log('=======confirmation:', confirmation)

    if (confirmation) {
      let downloaded = 0
      let contentLength = 0
      await update.downloadAndInstall((event) => {
        switch (event.event) {
          case 'Started':
            contentLength = event.data.contentLength!
            console.log(`started downloading ${event.data.contentLength} bytes`)
            break
          case 'Progress':
            downloaded += event.data.chunkLength
            console.log(`downloaded ${downloaded} from ${contentLength}`)
            break
          case 'Finished':
            console.log('download finished')
            break
        }
      })

      console.log('update installed')

      console.log('=========downloadAndInstall successfully')
      // await relaunch()
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
