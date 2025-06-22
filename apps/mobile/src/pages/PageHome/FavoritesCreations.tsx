import { CreationItem } from '@penx/components/area-widgets/CreationItem'
import { CreationCard } from '@penx/components/CreationCard/CreationCard'
import { useArea } from '@penx/hooks/useArea'
import { useCreations } from '@penx/hooks/useCreations'
import { mappedByKey } from '@penx/utils'

interface Props {
  //
}

export const FavoritesCreations = ({}: Props) => {
  const { creations: data } = useCreations()
  const { area } = useArea()
  const favorites = area.favorites || []
  const creationsMap = mappedByKey(data, 'id')
  const creations = favorites.map((id) => creationsMap[id])

  return (
    <>
      {creations.map((item) => (
        // <CreationItem creation={item} />
        <CreationCard creation={item} />
      ))}
    </>
  )
}
