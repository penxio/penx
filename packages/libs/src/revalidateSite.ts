import { Domain } from '@penx/db/client'
import { revalidateTag } from 'next/cache'

export function revalidateSite(domains: Domain[]) {
  try {
    for (const domain of domains) {
      revalidateTag(`site-${domain.domain}`)
    }
  } catch (error) {}
}
