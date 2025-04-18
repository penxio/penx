import { NETWORK, NetworkNames } from '@/lib/constants'
import { Creation, Site } from '@penx/db/client'
import { SyncService } from './SyncService'
import { api } from './trpc'

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
