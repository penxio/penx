const listCode = `import { IListItem, ListApp } from '@penxio/preset-ui'

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
}`

const formCode = `import { IListItem, ListApp } from '@penxio/preset-ui'

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
}`

const markdownCode = `import { MarkdownApp } from '@penxio/preset-ui'

export async function main() {
  new MarkdownApp({ content: '# Hello world' }).run()
}`

export const codeMap: Record<string, string> = {
  markdown: markdownCode,
  list: listCode,
  form: formCode,
}
