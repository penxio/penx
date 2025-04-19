import { atom, useAtom } from 'jotai'

const noteAtom = atom<string>('')

export function useNote() {
  const [note, setNote] = useAtom(noteAtom)
  return { note, setNote }
}
