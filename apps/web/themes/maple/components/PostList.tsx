import { Pagination } from '@/components/theme-ui/Pagination'
import { Creation, Site } from '@/lib/theme.types'
import { PostItem } from './PostItem'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface PostListProps {
  site: Site
  posts: Creation[]
  initialDisplayCreations?: Creation[]
  pagination?: PaginationProps
}

export function PostList({
  posts,
  initialDisplayCreations = [],
  pagination,
}: PostListProps) {
  const displayPosts =
    initialDisplayCreations.length > 0 ? initialDisplayCreations : posts

  return (
    <div className="">
      <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {displayPosts.map((post) => {
          return <PostItem key={post.slug} creation={post} />
        })}
      </div>
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
        />
      )}
    </div>
  )
}
