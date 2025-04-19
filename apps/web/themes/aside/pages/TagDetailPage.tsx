import { Creation, Site, Tag } from '@penx/types'
import { PostListWithTag } from '../components/PostListWithTag'

interface Props {
  site: Site
  creations: Creation[]
  tags: Tag[]
}

export function TagDetailPage({
  site,
  creations: posts = [],
  tags = [],
}: Props) {
  return <PostListWithTag site={site} creations={posts} tags={tags} />
}
