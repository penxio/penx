import { IListItem, ListApp } from '@penxio/preset-ui'
import { shell } from '@penxio/api'
import { db } from '@penx/local-db'
import { Manifest } from './types'

export async function main() {
  const app = new ListApp({
    isLoading: true,
    items: [],
  }).run()

  await loadExtensions(app)
}

async function loadExtensions(app: ListApp) {
  const list = await db.listExtensions()

  const items: IListItem[] = list
    .filter((i) => i.isDeveloping)
    .map((item, index) => {
      return {
        icon: item.icon || index + 1,
        title: item.title,
        subtitle: item.location,
        actions: [
          {
            type: 'CopyToClipboard',
            title: 'Copy Path to Clipboard',
            content: item.location || '',
          },
          {
            type: 'CustomAction',
            title: 'Show in Folder',
            icon: { name: 'lucide--folder' },
            onSelect: () => {
              shell.open(item.location || '')
            },
          },
          {
            type: 'ReleaseExtension',
            icon: { name: 'lucide--rocket' },
            title: 'Release Extension',
            location: item.location,
          },
          {
            type: 'CustomAction',
            icon: { name: 'lucide--trash' },
            title: 'Uninstall Developing Extension',
            onSelect: async () => {
              await db.deleteExtension(item.id)
              await loadExtensions(app)
            },
          },
        ],
      } as IListItem
    })

  app.setState({ items })
}
