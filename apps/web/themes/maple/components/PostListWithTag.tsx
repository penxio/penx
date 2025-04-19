import { Creation, Site, Tag } from '@penx/types'
import { FeatureBox } from './FeatureBox'
import { PostList } from './PostList'
import { TagList } from './TagList'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface PostListWithTagProps {
  site: Site
  posts: Creation[]
  featuredPost: Creation
  tags: Tag[]
  initialDisplayCreations?: Creation[]
  pagination?: PaginationProps
}

export function PostListWithTag({
  featuredPost,
  posts,
  site,
  tags = [],
  initialDisplayCreations = [],
  pagination,
}: PostListWithTagProps) {
  const displayPosts =
    initialDisplayCreations.length > 0 ? initialDisplayCreations : posts

  return (
    <div className="mt-12 flex flex-col gap-24">
      {featuredPost && <FeatureBox creation={featuredPost} />}

      <div className="flex flex-col gap-6">
        <TagList tags={tags} />
        <PostList posts={displayPosts} site={site} />
      </div>
    </div>
  )
}
