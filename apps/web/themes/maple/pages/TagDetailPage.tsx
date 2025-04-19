import { Creation, Site, Tag } from '@penx/types'
import { PostListWithTag } from '../components/PostListWithTag'

interface Props {
  site: Site
  allPosts: Creation[]
  posts: Creation[]
  tags: Tag[]
}

export function TagDetailPage({
  allPosts,
  site,
  posts = [],
  tags = [],
}: Props) {
  const featuredPost = allPosts.find((post) => post.featured) || posts[0]
  return (
    <PostListWithTag
      featuredPost={featuredPost}
      site={site}
      posts={posts}
      tags={tags}
    />
  )
}
