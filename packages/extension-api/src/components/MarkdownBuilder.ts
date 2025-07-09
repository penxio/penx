export interface MarkdownJSON {
  type: 'markdown'
  content: string
}

export function isMarkdownJSON(json: any): json is MarkdownJSON {
  return json.type === 'markdown'
}

export class MarkdownBuilder {
  constructor(public content = '') {}

  setContent = (content: string) => {
    this.content = content
    return this
  }

  toJSON() {
    return {
      type: 'markdown',
      content: this.content,
    }
  }
}
