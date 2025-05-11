import { ROOT_HOST } from '@penx/constants'

interface ContainerProps {
  name: string
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  return (
    <div id="container">
      <strong>{name}</strong>
      <p className="bg-background text-green-500">Explore UI Components</p>
      <div>{ROOT_HOST}</div>
    </div>
  )
}

export default ExploreContainer
