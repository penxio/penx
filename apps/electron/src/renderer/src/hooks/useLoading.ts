import { atom, useAtom } from 'jotai'

const loadingAtom = atom(false)
export function useLoading() {
  const [loading, setLoading] = useAtom(loadingAtom)

  return { loading, setLoading }
}
