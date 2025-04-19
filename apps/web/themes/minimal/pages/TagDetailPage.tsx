import { Creation, Site, Tag } from '@penx/types'
import { PostListWithTag } from '../components/PostListWithTag'

interface Props {
  site: Site
  posts: Creation[]
  tags: Tag[]
}

export function TagDetailPage({ site, posts = [], tags = [] }: Props) {
  return <PostListWithTag site={site} posts={posts} tags={tags} />
}
