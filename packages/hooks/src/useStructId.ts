import { atom, useAtom } from 'jotai'

export const structIdAtom = atom('')

export function useStructId() {
  const [structId, setStructId] = useAtom(structIdAtom)
  return { structId, setStructId }
}
