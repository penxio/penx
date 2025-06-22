import { NoCreationYet } from '@penx/components/area-widgets/components/NoCreationYet'
import { CreationCard } from '@penx/components/CreationCard/CreationCard'
import { useCreations } from '@penx/hooks/useCreations'

export function RecentlyEdited() {
  const { creations: data } = useCreations()

  const creations = [...data].sort(
    (a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf(),
  )

  if (!creations.length) return <NoCreationYet />
  return (
    <div className="flex flex-col gap-[1px] px-1 pb-2">
      {creations.map((item) => (
        <CreationCard key={item.id} creation={item} />
      ))}
    </div>
  )
}
