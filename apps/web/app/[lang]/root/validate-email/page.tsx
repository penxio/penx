import React from 'react'
import { ValidateEmail } from './ValidateEmail'

export const dynamic = 'force-static'
export const revalidate = 86400 // 3600 * 24

export default function Page() {
  return <ValidateEmail />
}
