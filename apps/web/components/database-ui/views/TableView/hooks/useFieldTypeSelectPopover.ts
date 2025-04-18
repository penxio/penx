import { atom, useAtom } from 'jotai'

const fieldTypeSelectPopover = atom<boolean>(false)

export function useFieldTypeSelectPopover() {
  const [isOpen, setIsOpen] = useAtom(fieldTypeSelectPopover)
  return { isOpen, setIsOpen }
}
