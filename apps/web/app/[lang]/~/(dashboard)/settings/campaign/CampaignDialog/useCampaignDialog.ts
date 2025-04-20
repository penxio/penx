import { Campaign } from '@prisma/client'
import { atom, useAtom } from 'jotai'

type State = {
  isOpen: boolean
  campaign: Campaign
}

const campaignDialogAtom = atom<State>({
  isOpen: false,
  campaign: null as any,
} as State)

export function useCampaignDialog() {
  const [state, setState] = useAtom(campaignDialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
