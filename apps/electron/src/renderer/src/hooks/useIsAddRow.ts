import { atom, useAtom } from 'jotai'

export const isAddRowAtom = atom<boolean>(false)

export function useIsAddRow() {
  const [isAddRow, setIsAddRow] = useAtom(isAddRowAtom)
  return { isAddRow, setIsAddRow }
}
