import { formatName, upFirst } from './utils'

export function getManifestJSON(template: string, title = '') {
  return `{
  "name": "${formatName(title)}",
  "title": "${upFirst(title)}",
  "description": "This is a ${template} demo.",
  "icon": {
    "name": "lucide--moon",
    "className": "bg-gradient-to-r from-violet-500 to-fuchsia-500"
  },
  "commands": [
    {
      "name": "${template}",
      "title": "${upFirst(template)} App",
      "icon": {
        "name": "lucide--pilcrow",
        "className": "bg-gradient-to-r from-rose-500 to-purple-500"
      },
      "mode": "preset-ui"
    }
  ]
}`
}
