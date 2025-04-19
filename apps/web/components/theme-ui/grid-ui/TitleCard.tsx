import { LayoutItem } from '@penx/types'

export function TitleCard({ item }: { item: LayoutItem }) {
  return (
    <div className="flex h-full w-full flex-col justify-end gap-1 pt-1">
      <div className="text-2xl font-bold">
        {item?.props?.title || 'Untitled'}
      </div>
      {item?.props?.subtitle && (
        <div className="text-foreground/50 text-sm">
          {item?.props?.subtitle}
        </div>
      )}
    </div>
  )
}
