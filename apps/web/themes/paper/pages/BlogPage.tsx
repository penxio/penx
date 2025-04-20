import { PageTitle } from '@penx/components/theme-ui/PageTitle'
import { Creation, Site } from '@penx/types'
import { Trans } from '@lingui/react/macro'
import { PostList } from '../components/PostList'

interface Props {
  site: Site
  creations: Creation[]
  initialDisplayCreations: Creation[]
  pagination: {
    currentPage: number
    totalPages: number
  }
}

export function BlogPage({
  site,
  creations = [],
  pagination,
  initialDisplayCreations,
}: Props) {
  return (
    <div className="space-y-6">
      <PageTitle>
        <Trans>Writings</Trans>
      </PageTitle>
      <PostList
        site={site}
        posts={creations}
        pagination={pagination}
        initialDisplayCreations={initialDisplayCreations}
      />
    </div>
  )
}
