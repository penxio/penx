import { NavLink } from '@/lib/theme.types'
import { atom, useAtom } from 'jotai'

type State = {
  isOpen: boolean
  index: number
  navLink: NavLink
}

const navLinkDialogAtom = atom<State>({
  isOpen: false,
  index: 0,
  navLink: null as any,
} as State)

export function useNavLinkDialog() {
  const [state, setState] = useAtom(navLinkDialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
