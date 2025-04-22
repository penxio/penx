import { get } from 'idb-keyval'
import { ACTIVE_SITE } from '@penx/constants'
import { ISite } from '@penx/model/ISite'

export async function getActiveSite() {
  const site = (await get(ACTIVE_SITE)) as ISite
  return site
}
