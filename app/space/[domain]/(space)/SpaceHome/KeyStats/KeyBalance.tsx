'use client'

import { Creation } from '@/domains/Creation'
import { useKeyBalance } from '@/hooks/useKeyBalance'
import { useAccount } from 'wagmi'

interface Props {
  creation: Creation
}

export function KeyBalance({ creation }: Props) {
  const { isConnected } = useAccount()
  if (!isConnected) return null
  return <Balance creation={creation} />
}

function Balance({ creation }: Props) {
  const { data, isLoading } = useKeyBalance(creation.id)

  console.log('=============data:', data)

  if (isLoading) return null

  return (
    <div>
      <div>{data!.toString()}</div>
    </div>
  )
}