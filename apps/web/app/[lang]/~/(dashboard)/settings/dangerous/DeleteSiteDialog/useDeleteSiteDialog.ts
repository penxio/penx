import { atom, useAtom } from 'jotai'

const deleteSiteDialogAtom = atom<boolean>(false)

export function useDeleteSiteDialog() {
  const [isOpen, setIsOpen] = useAtom(deleteSiteDialogAtom)
  return { isOpen, setIsOpen }
}
