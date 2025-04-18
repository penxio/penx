import { PageTitle } from '@/components/theme-ui/PageTitle'
import { Creation, Site, Tag } from '@/lib/theme.types'
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
    <div className="mx-auto flex max-w-2xl flex-col">
      <PageTitle className="text-center">Tags</PageTitle>
      <TagList tags={tags} />
      <div className="mt-10">
        <PostList site={site} creations={displayPosts} />
      </div>
    </div>
  )
}
