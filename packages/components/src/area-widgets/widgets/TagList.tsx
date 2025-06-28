import { useTags } from '@penx/hooks/useTags'
import { store } from '@penx/store'
import { PanelType } from '@penx/types'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@penx/uikit/tooltip'
import { Button } from '@penx/uikit/ui/button'
import { uniqueId } from '@penx/unique-id'
import { cn } from '@penx/utils'

interface Props {}

export function TagList({}: Props) {
  const { tags } = useTags()
  return (
    <div className={cn('flex flex-col gap-0.5 px-1 pb-2')}>
      {tags.map((tag) => (
        <div
          key={tag.id}
          className={cn(
            'text-foreground hover:bg-foreground/5 flex h-8 cursor-pointer items-center gap-1 rounded-md px-2 text-sm',
          )}
          onClick={() => {
            store.panels.openTag(tag.id)
          }}
        >
          <div>#</div>
          <div>{tag.name}</div>
          <div className="text-foreground/50 ml-auto text-xs">
            {tag.creationCount}
          </div>
        </div>
      ))}
    </div>
  )
}
