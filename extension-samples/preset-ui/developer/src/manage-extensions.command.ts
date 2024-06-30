import { IListItem, ListApp } from '@penxio/preset-ui'
import { db } from '@penx/local-db'

export async function main() {
  const app = new ListApp({
    isLoading: true,
    items: [],
  }).run()

  const list = await db.listExtensions()

  const items: IListItem[] = list
    .filter((i) => i.isDeveloping)
    .map((item, index) => {
      return {
        icon: index + 1,
        title: item.title,
        actions: [{ type: 'CopyToClipboard', content: index.toString() }],
      }
    })

  app.setState({ items })
}
