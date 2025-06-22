import { CreationCard } from '@penx/components/CreationCard/CreationCard'
import { useCreations } from '@penx/hooks/useCreations'

interface Props {
  //
}

export const AllCreations = ({}: Props) => {
  const { creations } = useCreations()
  return (
    <>
      {creations.map((item) => (
        <CreationCard key={item.id} creation={item} />
      ))}
    </>
  )
}
