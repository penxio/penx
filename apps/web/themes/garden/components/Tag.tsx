import { Link } from '@penx/libs/i18n'
import { cn } from '@penx/utils'
import { slug } from 'github-slugger'

interface Props {
  text: string
  className?: string
}

const Tag = ({ text, className }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className={cn(
        'text-brand hover:text-brand/80 dark:hover:text-brand/80 mr-3 text-base font-medium',
        className,
      )}
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
