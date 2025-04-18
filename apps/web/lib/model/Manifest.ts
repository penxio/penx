export interface ICommandItem {
  name: string
  title: string
  subtitle: string
  description: string
  icon?: string
  code?: string
}

export interface IManifest {
  name: string
  id: string
  version: string
  description: string
  author: string
  repo: string
  main: string
  code: string
  icon: string
  commands: ICommandItem[]
  screenshots: string[]
}

export class Manifest {
  raw: IManifest
  constructor(public _raw: string) {
    this.raw = JSON.parse(this._raw || '{}')
  }

  get id() {
    return this.raw.id
  }

  get name() {
    return this.raw.name
  }

  get author() {
    return this.raw.author
  }

  get repo() {
    return this.raw.repo || ''
  }

  get repoURL() {
    return 'https://github.com/' + this.raw.repo
  }

  get screenshots() {
    return this.raw.screenshots
  }

  get description() {
    return this.raw.description
  }
}
