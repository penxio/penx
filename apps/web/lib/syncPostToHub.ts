import { Creation, Site } from '@penx/db/client'
import { NetworkNames } from '@penx/constants'
import { api } from '@penx/trpc-client'
import { SyncService } from './SyncService'

export async function syncPostToHub(
  site: Site,
  creation: Creation,
  markdown = '',
) {
  const token = await api.github.getGitHubToken.query({
    installationId: site.installationId!,
  })
  const sync = await SyncService.init(token, site)
  await sync.pushPost(creation, markdown)
}
