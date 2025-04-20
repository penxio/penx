import { atom, useAtom } from 'jotai'

const googleOauthDialogAtom = atom<boolean>(false)

export function useGoogleOauthDialog() {
  const [isOpen, setIsOpen] = useAtom(googleOauthDialogAtom)
  return { isOpen, setIsOpen }
}
