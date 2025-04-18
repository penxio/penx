import { PageTitle } from '@/components/theme-ui/PageTitle'
import { Tag } from '@/lib/theme.types'
import { Trans } from '@lingui/react/macro'
import { TagList } from '../components/TagList'

interface Props {
  tags: Tag[]
}

export function TagListPage({ tags }: Props) {
  return (
    <div className="relative mx-auto max-w-2xl">
      <PageTitle className="">
        <Trans>Tags</Trans>
      </PageTitle>
      <div className="grid gap-y-3">
        {tags.length === 0 && 'No tags found.'}
        {tags.length > 0 && <TagList tags={tags} />}
      </div>
    </div>
  )
}
