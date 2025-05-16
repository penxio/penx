import { slug } from 'github-slugger'
import { Link } from '@penx/libs/i18n'
import { CreationTag } from '@penx/types'
import { cn } from '@penx/utils'

interface Props {
  postTag: CreationTag
  className?: string
}

const Tag = ({ postTag, className }: Props) => {
  return (
    <Link
      href={`/tags/${slug(postTag.tag.name)}`}
      className={cn(
        'text-brand hover:text-brand/80 dark:hover:text-brand/80 mr-3 text-base font-medium',
        className,
      )}
    >
      {postTag.tag.name.split(' ').join('-')}
    </Link>
  )
}

export default Tag
