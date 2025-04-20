import { NETWORK, NetworkNames } from '@penx/constants'
import { Creation, Site } from '@prisma/client'
import { SyncService } from './SyncService'
import { api } from '@penx/trpc-client'

export async function syncPostToHub(
  site: Site,
  creation: Creation,
  markdown = '',
) {
  // if (NETWORK !== NetworkNames.BASE) return
  const token = await api.github.getGitHubToken.query({
    installationId: site.installationId!,
  })
  const sync = await SyncService.init(token, site)
  await sync.pushPost(creation, markdown)
}
