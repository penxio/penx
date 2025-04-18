import { Creation, Site, Tag } from '@/lib/theme.types'
import { PostListWithTag } from '../components/PostListWithTag'

interface Props {
  site: Site
  creations: Creation[]
  tags: Tag[]
}

export function TagDetailPage({ site, creations = [], tags = [] }: Props) {
  return <PostListWithTag site={site} creations={creations} tags={tags} />
}
