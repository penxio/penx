import { Link } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface Props {
  className?: string
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export function PaginationNav({ prev, next, className }: Props) {
  return (
    <footer>
      <div
        className={cn(
          'flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base',
          className,
        )}
      >
        {prev && prev.path && (
          <div className="pt-4 xl:pt-8">
            <Link
              href={`/${prev.path}`}
              className="text-brand hover:text-brand/80 dark:hover:text-brand/80"
              aria-label={`Previous post: ${prev.title}`}
            >
              &larr; {prev.title}
            </Link>
          </div>
        )}
        {next && next.path && (
          <div className="pt-4 xl:pt-8">
            <Link
              href={`/${next.path}`}
              className="text-brand hover:text-brand/80 dark:hover:text-brand/80"
              aria-label={`Next post: ${next.title}`}
            >
              {next.title} &rarr;
            </Link>
          </div>
        )}
      </div>
    </footer>
  )
}
