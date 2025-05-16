import { atom, useAtom } from 'jotai'

export const creationIdAtom = atom('')

export function useCreationId() {
  const [creationId, setCreationId] = useAtom(creationIdAtom)
  return { creationId, setCreationId }
}
