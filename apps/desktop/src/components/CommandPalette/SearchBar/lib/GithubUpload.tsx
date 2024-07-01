import { join } from '@tauri-apps/api/path'
import { exists, readDir, readTextFile } from '@tauri-apps/plugin-fs'
import { Octokit } from 'octokit'
import { escAction } from './constants'
import { getManifest } from './getManifest'
import { getReadme } from './getReadme'
import { readFileToBase64 } from './readFileToBase64'

export type TreeItem = {
  path: string
  // mode: '100644' | '100755' | '040000' | '160000' | '120000'
  mode: '100644'
  // type: 'blob' | 'tree' | 'commit'
  type: 'blob'
  content?: string
  sha?: string | null
}

export class GithubUpload {
  private app: Octokit

  private params = {
    owner: 'penxio',
    repo: 'marketplace',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  }

  private baseBranchSha: string

  constructor(
    private location: string,
    token: string,
  ) {
    this.app = new Octokit({ auth: token })
  }

  async getReadmeContent(extensionName: string) {
    const readme = await getReadme(this.location)
    if (!readme) return `## ${extensionName}`
    return readme
  }

  private async getInstallationContent() {
    const manifest = await getManifest(this.location)

    // add code manifest.commands
    for (const command of manifest.commands) {
      const codePath = await join(this.location, 'dist', `${command.name}.command.js`)
      const code = await readTextFile(codePath)
      command.code = code + escAction
    }

    // const assets = await assetsToStringMap()
    const assets = {}
    return JSON.stringify({ ...manifest, assets }, null, 2)
  }

  async createTree() {
    let treeItems: TreeItem[] = []
    const manifest = await getManifest(this.location)

    for (const command of manifest.commands) {
      const codePath = await join(this.location, 'dist', `${command.name}.command.js`)
      const code = await readTextFile(codePath)

      treeItems.push({
        path: `extensions/${manifest.name}/dist/${command.name}.command.js`,
        mode: '100644',
        type: 'blob',
        content: code + escAction,
      })
    }

    /** assets */
    const assets = await join(this.location, 'assets')

    if (await exists(assets)) {
      const files = await readDir(assets)

      for (const file of files) {
        if (!file.isFile || file.name.includes('.DS_Store')) continue
        const filePath = await join(this.location, 'assets', file.name)
        const fileItem = await this.createFileTreeItem(manifest.name, filePath, file.name, 'assets')
        treeItems.push(fileItem)
      }
    }

    /** screenshots */
    const screenshots = await join(this.location, 'screenshots')

    if (await exists(screenshots)) {
      const files = await readDir(screenshots)
      for (const file of files) {
        if (!file.isFile || file.name.includes('.DS_Store')) continue
        const filePath = await join(this.location, 'screenshots', file.name)
        const fileItem = await this.createFileTreeItem(
          manifest.name,
          filePath,
          file.name,
          'screenshots',
        )
        treeItems.push(fileItem)
      }
    }

    treeItems.push({
      path: `extensions/${manifest.name}/manifest.json`,
      mode: '100644',
      type: 'blob',
      content: JSON.stringify(manifest, null, 2),
    })

    treeItems.push({
      path: `extensions/${manifest.name}/README.md`,
      mode: '100644',
      type: 'blob',
      content: await this.getReadmeContent(manifest.name),
    })

    treeItems.push({
      path: `extensions/${manifest.name}/installation.json`,
      mode: '100644',
      type: 'blob',
      content: await this.getInstallationContent(),
    })

    return treeItems
  }

  async getBaseCommit() {
    const ref = await this.app.request('GET /repos/{owner}/{repo}/git/ref/{ref}', {
      ...this.params,
      ref: `heads/main`,
    })

    this.baseBranchSha = ref.data.object.sha
    return this.baseBranchSha
  }

  async createFileTreeItem(
    extensionName: string,
    filePath: string,
    fileName: string,
    dirname: string,
  ) {
    const content = await readFileToBase64(filePath)
    const { data } = await this.app.request('POST /repos/{owner}/{repo}/git/blobs', {
      ...this.params,
      content: content,
      encoding: 'base64',
    })

    const item: TreeItem = {
      path: `extensions/${extensionName}/${dirname}/${fileName}`,
      mode: '100644',
      type: 'blob',
      sha: data.sha,
    }

    return item
  }

  private async commit(treeSha: string) {
    const parentSha = this.baseBranchSha
    const manifest = await getManifest(this.location)
    const msg = `Release extension: ${manifest.name}`

    const commit = await this.app.request('POST /repos/{owner}/{repo}/git/commits', {
      ...this.params,
      message: `${msg}`,
      parents: [parentSha],
      tree: treeSha,
    })
    return commit
  }

  private async updateRef(commitSha: string = '') {
    await this.app.request('PATCH /repos/{owner}/{repo}/git/refs/{ref}', {
      ...this.params,
      ref: 'heads/main',
      sha: commitSha,
      force: true,
    })
  }

  uploadToGitHub = async () => {
    const baseCommit = await this.getBaseCommit()

    // update tree to GitHub before commit
    const { data } = await this.app.request('POST /repos/{owner}/{repo}/git/trees', {
      ...this.params,
      tree: await this.createTree(),
      base_tree: baseCommit,
    })

    // create a commit for the tree
    const { data: commitData } = await this.commit(data.sha)

    // update ref to GitHub server after commit
    await this.updateRef(commitData.sha)
  }
}
