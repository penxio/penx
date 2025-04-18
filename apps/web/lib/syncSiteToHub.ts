import { NETWORK, NetworkNames } from '@/lib/constants'
import { Site } from '@penx/db/client'
import { SyncService } from './SyncService'

export async function syncSiteToHub(site: Site) {
  // if (NETWORK !== NetworkNames.BASE) return
  // const token = await getTokenByInstallationId(site.installationId!)
  // const sync = await SyncService.init(token, site)
  // await sync.pushSite(site)
}
