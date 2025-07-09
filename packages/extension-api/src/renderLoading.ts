import { EventType } from './constants'

type Spinner = {
  type: 'spinner'
}

type Skeleton = {
  type: 'skeleton'
}

export type LoadingType = Spinner | Skeleton

export function renderLoading(data?: LoadingType) {
  postMessage({
    type: EventType.Loading,
    payload: data,
  })
}
