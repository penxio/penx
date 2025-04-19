import { PropsWithChildren } from 'react'
import { Skeleton } from '@penx/ui/components/skeleton'

interface Props {
  isLoading: boolean
}

export function GithubConnectionBox({
  children,
  isLoading,
  ...rest
}: PropsWithChildren<Props>) {
  return (
    <div {...rest}>
      {isLoading && (
        <div className="flex justify-between">
          <div className="flex items-center justify-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="h-11 w-32 rounded-2xl" />
        </div>
      )}

      {!isLoading && <div>{children}</div>}
    </div>
  )
}
