import React from 'react'
import { useSession } from '@penx/session'
import { DesktopLogin } from './DesktopLogin'

export const dynamic = 'force-static'
export const revalidate = 86400 // 3600 * 24

export default function Page() {
  return <DesktopLogin />
}
