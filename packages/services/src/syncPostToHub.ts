import { Creation, Site } from '@prisma/client'
import { NetworkNames } from '@penx/constants'
import { SyncService } from './SyncService'

// import { api } from '@penx/trpc-client'

export async function syncPostToHub(
  site: Site,
  creation: Creation,
  markdown = '',
) {
  // const token = await api.github.getGitHubToken.query({
  //   installationId: site.installationId!,
  // })
  // const sync = await SyncService.init(token, site)
  // await sync.pushPost(creation, markdown)
}
