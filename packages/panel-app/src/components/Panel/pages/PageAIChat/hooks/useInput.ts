import { atom, useAtom } from 'jotai'

export const inputAtom = atom('')
export function useInput() {
  const [input, setInput] = useAtom(inputAtom)
  return { input, setInput }
}
