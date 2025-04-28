import { PageTitle } from '@penx/components/PageTitle'
import { Tag } from '@penx/types'
import { Trans } from '@lingui/react'
import { TagList } from '../components/TagList'

interface Props {
  tags: Tag[]
}

export function TagListPage({ tags }: Props) {
  return (
    <div className="flex flex-col">
      <PageTitle className="mt-8">
        <Trans id="Tags"></Trans>
      </PageTitle>
      <div className="grid gap-y-3">
        {tags.length === 0 && <Trans id="No tags found."></Trans>}
        {tags.length > 0 && <TagList tags={tags} />}
      </div>
    </div>
  )
}
