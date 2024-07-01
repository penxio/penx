import { join } from '@tauri-apps/api/path'
import { readTextFile } from '@tauri-apps/plugin-fs'

type CommandItem = {
  name: string
  title: string
  subtitle: string
  description: string
  icon?: string | Record<string, string>
  code?: string
  mode: 'preset-ui' | 'custom-ui' | 'no-view'
  framework: 'vue' | 'react' | 'solid' | 'svelte'
}

type Manifest = {
  name: string
  title: string
  version: string
  description: string
  main: string
  code: string
  icon: string | Record<string, string>
  commands: CommandItem[]
  screenshots: Record<string, string>
}

export async function getManifest(location: string) {
  const manifestPath = await join(location!, 'manifest.json')
  const manifestStr = await readTextFile(manifestPath)
  const manifest = JSON.parse(manifestStr)
  return manifest as Manifest
}
