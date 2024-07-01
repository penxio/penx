export type CommandItem = {
  name: string
  title: string
  subtitle: string
  description: string
  icon?: string | Record<string, string>
  code?: string
  mode: 'preset-ui' | 'custom-ui' | 'no-view'
  framework: 'vue' | 'react' | 'solid' | 'svelte'
}

export type Manifest = {
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
