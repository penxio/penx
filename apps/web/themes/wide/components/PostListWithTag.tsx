import { PageTitle } from '@/components/theme-ui/PageTitle'
import { Creation, Site, Tag } from '@penx/types'
import { PostList } from './PostList'
import { TagList } from './TagList'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface PostListWithTagProps {
  site: Site
  creations: Creation[]
  tags: Tag[]
  initialDisplayCreations?: Creation[]
  pagination?: PaginationProps
}

export function PostListWithTag({
  site,
  creations,
  tags = [],
  initialDisplayCreations = [],
  pagination,
}: PostListWithTagProps) {
  const displayPosts =
    initialDisplayCreations.length > 0 ? initialDisplayCreations : creations

  return (
    <div className="flex flex-col">
      <PageTitle className="mt-0">Tags</PageTitle>
      <TagList tags={tags} />
      <div className="mt-10">
        <PostList site={site} creations={displayPosts} />
      </div>
    </div>
  )
}
