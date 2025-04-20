import { GridLayoutUI } from '@penx/components/theme-ui/grid-ui/GridLayoutUI'
import {
  Creation,
  CreationType,
  Friend,
  LayoutItem,
  Project,
  Site,
  Tag,
} from '@penx/types'

interface Props {
  site: Site
  tags: any[]
  posts: Creation[]
  podcasts: Creation[]
  projects: Project[]
  friends: Friend[]
  about: any
}

export function HomePage({
  posts = [],
  tags,
  projects = [],
  friends = [],
  podcasts = [],
  about,
  site,
}: Props) {
  return (
    <GridLayoutUI
      creations={posts}
      podcasts={podcasts}
      friends={friends}
      projects={projects}
      site={site}
    />
  )
}
