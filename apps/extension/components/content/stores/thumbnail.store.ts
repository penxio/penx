import { getState, mutate, useStore } from 'stook'

const key = 'Thumbnail'

type State = {
  x: number
  y: number
  clientX: number
  clientY: number
  visible: boolean
}

export function useThumbnail() {
  const [state, setThumbnail] = useStore<State>(key, {
    visible: false,
  } as State)
  return {
    visible: state.visible,
    x: state.x,
    y: state.y,
    clientX: state.clientX,
    clientY: state.clientY,
    setState: setThumbnail,
  }
}

export function showThumbnail(
  x: number,
  y: number,
  clientX: number,
  clientY: number,
) {
  mutate(key, (state: State) => {
    state.visible = true
    state.x = x
    state.y = y
    state.clientX = clientX
    state.clientX = clientY
  })
}

export function hideThumbnail() {
  mutate(key, (state: State) => {
    state.visible = false
  })
}

export function getThumbnailState(): State {
  return getState(key)
}
