import { Domain } from '@penx/db/client'
import { revalidateTag } from 'next/cache'
import { ROOT_DOMAIN } from './constants'

export function revalidateSite(domains: Domain[]) {
  try {
    for (const domain of domains) {
      revalidateTag(`site-${domain.domain}`)
    }
  } catch (error) {}
}
