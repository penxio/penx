import { join } from '@tauri-apps/api/path'
import { readTextFile } from '@tauri-apps/plugin-fs'
import { readFileToBase64 } from './readFileToBase64'

export async function iconToString(location: string, icon: any) {
  if (!icon) return ''

  try {
    const iconPath = await join(location, 'assets', icon)
    if (icon.endsWith('.svg')) {
      return readTextFile(iconPath) || ''
    } else {
      return readFileToBase64(iconPath)
    }
  } catch (error) {
    return ''
  }
}
