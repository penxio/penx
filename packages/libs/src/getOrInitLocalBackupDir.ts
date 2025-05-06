import { get, set } from 'idb-keyval'
import { LOCAL_AUTO_BACKUP_DIR } from '@penx/constants'

export async function getOrInitLocalBackupDir() {
  const { BaseDirectory, documentDir, join } = await import(
    '@tauri-apps/api/path'
  )
  const { exists, mkdir } = await import('@tauri-apps/plugin-fs')

  const baseDir = BaseDirectory.Document
  const dirName = 'penx-auto-backup'

  let path = await get(LOCAL_AUTO_BACKUP_DIR)
  console.log('=========11111111111:', path)

  if (!path || !(await exists(dirName, { baseDir }))) {
    const documentDirPath = await documentDir()

    console.log('=======documentDirPath:', documentDirPath)

    if (!(await exists(dirName, { baseDir }))) {
      await mkdir(dirName, { baseDir: BaseDirectory.Document })
    }

    path = await join(documentDirPath, 'penx-auto-backup')

    set(LOCAL_AUTO_BACKUP_DIR, path)
  }

  console.log('=========path xxx:', path)

  return path
}
