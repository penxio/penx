'use client'

import { useCallback, useEffect } from 'react'
import { Getter, Setter } from 'jotai'
import { useAtomCallback } from 'jotai/utils'

export let readAtom!: Getter
export let writeAtom!: Setter

export const JotaiNexus = () => {
  const init = useAtomCallback(
    useCallback((get, set) => {
      readAtom = get
      writeAtom = set
    }, []),
  )

  useEffect(() => {
    init()
  }, [init])

  return null
}
