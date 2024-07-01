import { readFile } from '@tauri-apps/plugin-fs'

export async function readFileToBase64(filePath: string) {
  try {
    const binaryContent = await readFile(filePath)
    const binaryString = String.fromCharCode(...binaryContent)

    const base64String = btoa(binaryString)

    return base64String
  } catch (error) {
    console.error('Error reading file:', error)
    throw error
  }
}
