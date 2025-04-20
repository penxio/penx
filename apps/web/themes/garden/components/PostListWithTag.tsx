import { PageTitle } from '@penx/components/theme-ui/PageTitle'
import { Creation, Site, Tag } from '@penx/types'
import { PostList } from './PostList'
import { TagList } from './TagList'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface PostListWithTagProps {
  site: Site
  posts: Creation[]
  tags: Tag[]
  initialDisplayCreations?: Creation[]
  pagination?: PaginationProps
}

export function PostListWithTag({
  site,
  posts,
  tags = [],
  initialDisplayCreations = [],
  pagination,
}: PostListWithTagProps) {
  const displayPosts =
    initialDisplayCreations.length > 0 ? initialDisplayCreations : posts

  return (
    <div className="flex flex-col">
      <PageTitle className="mt-0">Tags</PageTitle>
      <TagList tags={tags} />
      <div className="mt-10">
        <PostList site={site} posts={displayPosts} />
      </div>
    </div>
  )
}
