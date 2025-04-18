import { atom, useAtom } from 'jotai'

export const searchAtom = atom('')
export function useSearch() {
  const [search, setSearch] = useAtom(searchAtom)

  return { search, setSearch }
}
