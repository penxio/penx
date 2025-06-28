import { ChevronRightIcon } from 'lucide-react'
import { appEmitter } from '@penx/emitter'
import { useTags } from '@penx/hooks/useTags'
import { store } from '@penx/store'
import { cn } from '@penx/utils'

interface Props {}

export function TagList({}: Props) {
  const { tags } = useTags()
  return (
    <div className={cn('flex flex-col gap-0.5 pb-2')}>
      {tags.map((tag) => (
        <div
          key={tag.id}
          className={cn(
            'text-foreground hover:bg-foreground/5 bg-amber-200-10 flex  h-10 cursor-pointer items-center gap-1 rounded-md text-lg',
          )}
          onClick={() => {
            appEmitter.emit('ROUTE_TO_TAG_CREATIONS', tag)
          }}
        >
          <div>#</div>
          <div>{tag.name}</div>
          <div className="ml-auto flex items-center">
            <div className="text-foreground/50 ml-auto text-xs">
              {tag.creationCount}
            </div>
            <ChevronRightIcon size={24} className="text-foreground/50" />
          </div>
        </div>
      ))}
    </div>
  )
}
