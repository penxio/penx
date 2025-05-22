import { atom, useAtom } from 'jotai'
import { Struct } from '@penx/domain'

const activeAtom = atom<Struct | null>(null)

export function useActiveStruct() {
  const [struct, setStruct] = useAtom(activeAtom)

  return {
    struct,
    setStruct,
  }
}
