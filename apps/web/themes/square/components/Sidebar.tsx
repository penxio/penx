import { Creation, Site } from '@penx/types'
import { AboutCard } from './AboutCard'
import { FeaturedPosts } from './FeaturedPosts'
import { MostPopular } from './MostPopular'

interface Props {
  about: any
  site: Site
  popularPosts: Creation[]
  featuredPosts: Creation[]
}

export const Sidebar = ({
  site,
  popularPosts,
  featuredPosts,
  about,
}: Props) => {
  return (
    <div className="w-full shrink-0 space-y-10 sm:w-[340px]">
      <MostPopular posts={popularPosts} />
      <FeaturedPosts posts={featuredPosts} />
      <AboutCard site={site} about={about} />
    </div>
  )
}
