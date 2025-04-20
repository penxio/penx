import { atom, useAtom } from 'jotai'

export const appLoading = atom<boolean>(false)
export function useAppLoading() {
  const [loading, setLoading] = useAtom(appLoading)
  return { loading, setLoading }
}
