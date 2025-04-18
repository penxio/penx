import { mutate, useStore } from 'stook'

const keyPostfix = '-CompositionData'
export function useCompositionData(nodeId = '') {
  const [compositionData, setCompositionData] = useStore(
    nodeId + keyPostfix,
    '',
  )
  return { compositionData, setCompositionData }
}

export function mutateCompositionData(nodeId = '', data = '') {
  mutate(nodeId + keyPostfix, data)
}
