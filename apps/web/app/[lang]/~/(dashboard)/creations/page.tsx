'use client'

import { CreationType } from '@penx/types'
import { useSearchParams } from 'next/navigation'
import { Friends } from './Friends/Friends'
import { Images } from './Images/Images'
import { Podcasts } from './Podcasts/Podcasts'
import { Projects } from './Projects/Projects'

export const dynamic = 'force-static'

export default function Page() {
  const searchParams = useSearchParams()
  const type = searchParams?.get?.('type')
  if (!type) return null

  if (type === CreationType.IMAGE) return <Images />
  if (type === CreationType.AUDIO) return <Podcasts />
  if (type === CreationType.FRIEND) return <Friends />
  if (type === CreationType.PROJECT) return <Projects />
  return null
}
