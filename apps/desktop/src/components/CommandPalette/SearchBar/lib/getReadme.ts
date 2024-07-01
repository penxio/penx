import { join } from '@tauri-apps/api/path'
import { readTextFile } from '@tauri-apps/plugin-fs'

export async function getReadme(location: string) {
  try {
    try {
      const path = await join(location, 'readme.md')
      return readTextFile(path) || ''
    } catch (error) {
      const path = await join(location, 'README.md')
      return readTextFile(path) || ''
    }
  } catch (error) {
    return ''
  }
}
