import { mutate, useStore } from 'stook'

const key = 'TEXT_SELECTED'

type State = {
  text: string
  selected?: boolean
}

export function useText() {
  const [state, setState] = useStore<State>(key, { text: '' } as State)
  const setText = (value: string) => {
    setState((state) => {
      state.text = value
    })
  }
  return {
    ...state,
    setText,
  }
}

export function updateText(text: string) {
  mutate(key, { text })
}
