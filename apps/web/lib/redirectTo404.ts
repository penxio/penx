import { notFound, redirect } from 'next/navigation'
import { ROOT_DOMAIN } from '@penx/constants'

export function redirectTo404() {
  notFound()
  // redirect(`https://${ROOT_DOMAIN}/404`)
}
