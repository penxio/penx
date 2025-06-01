import { useAtomValue } from 'jotai'
import { Journal } from '@penx/domain'
import { journalsAtom } from '@penx/store'

export function useJournals() {
  const raw = useAtomValue(journalsAtom)
  return {
    raw,
    journals: raw.map((r) => new Journal(r) as Journal),
  }
}
