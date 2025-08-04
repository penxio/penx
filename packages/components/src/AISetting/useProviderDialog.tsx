import { atom, useAtom } from 'jotai'
import { AIProvider } from '@penx/model-type'
import { LLMProviderType } from '@penx/types'

type State = {
  open: boolean
  provider?: AIProvider
  providerType: LLMProviderType
}

const dialogAtom = atom<State>({
  open: false,
  provider: null as any,
  providerType: '' as any,
} as State)

export function useProviderDialog() {
  const [state, setState] = useAtom(dialogAtom)
  return {
    ...state,
    setOpen: (open: boolean) =>
      setState({
        ...state,
        open,
      }),
    setState,
  }
}
