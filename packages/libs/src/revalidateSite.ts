import { revalidateTag } from 'next/cache'
import { Domain } from '@penx/db/client'

export function revalidateSite(domains: Domain[]) {
  try {
    for (const domain of domains) {
      revalidateTag(`site-${domain.domain}`)
    }
  } catch (error) {}
}
