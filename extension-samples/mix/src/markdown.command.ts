import { MarkdownApp } from '@penxio/preset-ui'

export async function main() {
  new MarkdownApp({ content: '# Hello world' }).run()
}
