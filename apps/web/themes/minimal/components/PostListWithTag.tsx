import { PageTitle } from '@penx/components/PageTitle'
import { Creation, Site, Tag } from '@penx/types'
import { Trans } from '@lingui/react'
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
  posts,
  site,
  tags = [],
  initialDisplayCreations = [],
  pagination,
}: PostListWithTagProps) {
  const displayPosts =
    initialDisplayCreations.length > 0 ? initialDisplayCreations : posts

  return (
    <div className="flex flex-col">
      <PageTitle>
        <Trans id="Tags"></Trans>
      </PageTitle>
      <TagList tags={tags} />
      <div className="mt-10">
        <PostList posts={displayPosts} site={site} />
      </div>
    </div>
  )
}
