import { Creation, Site } from '@/lib/theme.types'
import { AboutCard } from './AboutCard'
import { MostPopular } from './MostPopular'

interface Props {
  about: any
  site: Site
  posts: Creation[]
}

export const Sidebar = ({ site, posts, about }: Props) => {
  return (
    <div className="w-full shrink-0 space-y-20 sm:w-[340px]">
      <MostPopular creations={posts} />
      <AboutCard site={site} about={about} />
    </div>
  )
}
