import { Octokit } from 'octokit'

export type TreeItem = {
  path: string
  // mode: '100644' | '100755' | '040000' | '160000' | '120000'
  mode: '100644'
  // type: 'blob' | 'tree' | 'commit'
  type: 'blob'
  content?: string
  sha?: string | null
}

interface SharedParams {
  owner: string
  repo: string
  headers: {
    'X-GitHub-Api-Version': string
  }
}

type Content = {
  content?: string
  name: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string
  git_url: string
  download_url: string
  type: 'file' | 'dir'
}

export class SyncService {
  private params: SharedParams

  private app: Octokit

  private baseBranchSha: string

  private space: any
  private creation: any

  filesTree: Content[]

  commitSha: string

  get baseBranchName() {
    return 'main'
  }

  setSharedParams(owner: string, repo: string) {
    const sharedParams = {
      owner,
      repo,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    }
    this.params = sharedParams
  }

  static async init(token: string, space: any) {
    const s = new SyncService()
    const [owner, repo] = (space.repo || '').split('/')
    s.setSharedParams(owner, repo)
    s.app = new Octokit({ auth: token })
    return s
  }

  private async updateRef(commitSha: string = '') {
    const branchName = this.baseBranchName
    await this.app.request('PATCH /repos/{owner}/{repo}/git/refs/{ref}', {
      ...this.params,
      ref: `heads/${branchName}`,
      sha: commitSha,
      force: true,
    })
  }

  private async commit(treeSha: string) {
    const parentSha = this.baseBranchSha
    const msg = this.creation
      ? `Publish post: ${this.creation.title}`
      : 'Push site'

    const commit = await this.app.request(
      'POST /repos/{owner}/{repo}/git/commits',
      {
        ...this.params,
        message: `${msg}`,
        parents: [parentSha],
        tree: treeSha,
      },
    )
    return commit
  }

  async getBaseBranchInfo() {
    const ref = await this.app.request(
      'GET /repos/{owner}/{repo}/git/ref/{ref}',
      {
        ...this.params,
        ref: `heads/${this.baseBranchName}`,
      },
    )

    const refSha = ref.data.object.sha

    this.baseBranchSha = refSha
  }

  async getSiteTree() {
    let tree: TreeItem[] = []
    const item = {
      path: `sites/${this.space.id}.json`,
      mode: '100644',
      type: 'blob',
      content: JSON.stringify(this.space, null, 2),
    } as TreeItem

    tree.push(item)

    return tree
  }

  async getPostTree(markdown = '') {
    let tree: TreeItem[] = []

    tree.push({
      path: `json/${this.creation.id}.json`,
      mode: '100644',
      type: 'blob',
      content: JSON.stringify(this.creation, null, 2),
    })

    tree.push({
      path: `markdown/${this.creation.id}.md`,
      mode: '100644',
      type: 'blob',
      content: markdown,
    })

    return tree
  }

  async pushSpace(space: any) {
    this.space = space
    let tree: TreeItem[] = []
    tree = await this.getSiteTree()
    await this.pushTree(tree)
  }

  async pushPost(post: any, markdown = '') {
    this.creation = post
    let tree: TreeItem[] = []
    tree = await this.getPostTree(markdown)

    await this.pushTree(tree)
  }

  async pushTree(tree: TreeItem[]) {
    // console.log('===========push tree....')
    await this.getBaseBranchInfo()

    // update tree to GitHub before commit
    const { data } = await this.app.request(
      'POST /repos/{owner}/{repo}/git/trees',
      {
        ...this.params,
        tree,
        base_tree: this.baseBranchSha,
      },
    )

    // create a commit for the tree
    const { data: commitData } = await this.commit(data.sha)

    // update ref to GitHub server after commit
    await this.updateRef(commitData.sha)
  }
}
