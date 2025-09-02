import { atom, useAtom } from 'jotai'

export const commandLoadingAtom = atom<boolean>(false)

export function useCommandAppLoading() {
  const [loading, setLoading] = useAtom(commandLoadingAtom)

  return {
    loading,
    setLoading,
  }
}
