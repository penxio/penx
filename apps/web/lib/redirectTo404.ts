import { notFound, redirect } from 'next/navigation'
import { ROOT_DOMAIN } from './constants'

export function redirectTo404() {
  notFound()
  // redirect(`https://${ROOT_DOMAIN}/404`)
}
