import { Trans } from '@lingui/react'
import { PageTitle } from '@penx/components/PageTitle'
import { Creation, Site } from '@penx/types'
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
      <PageTitle className="mt-0">
        <Trans id="Writings"></Trans>
      </PageTitle>
      <PostList
        site={site}
        creations={creations}
        pagination={pagination}
        initialDisplayCreations={initialDisplayCreations}
      />
    </div>
  )
}
