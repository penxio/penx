import { NetworkNames } from '@penx/constants'
import { Site } from '@penx/db/client'
import { SyncService } from './SyncService'

export async function syncSiteToHub(site: Site) {
  // const token = await getTokenByInstallationId(site.installationId!)
  // const sync = await SyncService.init(token, site)
  // await sync.pushSite(site)
}
