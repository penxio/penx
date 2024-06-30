import { IListItem, ListApp } from '@penxio/preset-ui'

export async function main() {
  const app = new ListApp({
    items: [],
  }).run()

  const items: IListItem[] = Array(10)
    .fill('')
    .map((_, index) => ({
      icon: index + 1,
      title: 100 + index.toString(),
      actions: [{ type: 'CopyToClipboard', content: index.toString() }],
    }))

  setTimeout(() => {
    app.setState({
      items,
    })
  }, 1)
}
