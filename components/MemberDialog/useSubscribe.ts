import { useAddress } from '@/hooks/useAddress'
import { useMembers } from '@/hooks/useMembers'
import { refetchSpaces } from '@/hooks/useSpaces'
import { useSubscription } from '@/hooks/useSubscription'
import { erc20Abi, spaceAbi } from '@/lib/abi'
import { checkChain } from '@/lib/checkChain'
import { SubscriptionType } from '@/lib/constants'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { api } from '@/lib/trpc'
import { wagmiConfig } from '@/lib/wagmi'
import { RouterOutputs } from '@/server/_app'
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from '@wagmi/core'
import { toast } from 'sonner'
import { Address } from 'viem'
import { useWriteContract } from 'wagmi'
import { useMemberDialog } from './useMemberDialog'

export function useSubscribe(space: RouterOutputs['space']['byId']) {
  const members = useMembers(space.id)
  const { writeContractAsync } = useWriteContract()
  const address = useAddress()
  const subscription = useSubscription()
  const { setIsOpen } = useMemberDialog()

  return async (
    token: string,
    amount: bigint,
    isSubscribe: boolean,
    duration: number,
  ) => {
    const subscriptionType = isSubscribe
      ? SubscriptionType.SUBSCRIBE
      : SubscriptionType.UNSUBSCRIBE

    const spaceAddress = space.spaceAddress as Address
    try {
      await checkChain()
      if (isSubscribe) {
        let hash: any = ''

        if (token === 'ETH') {
          hash = await writeContractAsync({
            address: spaceAddress,
            abi: spaceAbi,
            functionName: 'subscribeByEth',
            args: [0],
            value: amount,
          })
        } else {
          const approveTx = await writeContractAsync({
            address: spaceAddress,
            abi: erc20Abi,
            functionName: 'approve',
            args: [spaceAddress, amount],
          })

          await waitForTransactionReceipt(wagmiConfig, { hash: approveTx })

          hash = await writeContractAsync({
            address: spaceAddress,
            abi: spaceAbi,
            functionName: 'subscribe',
            args: [0, amount],
          })
        }

        await waitForTransactionReceipt(wagmiConfig, { hash })
      } else {
        const hash = await writeContractAsync({
          address: spaceAddress,
          abi: spaceAbi,
          functionName: 'unsubscribe',
          args: [0, amount],
        })

        console.log('========amount:', amount)

        await waitForTransactionReceipt(wagmiConfig, { hash })
      }

      const info = await readContract(wagmiConfig, {
        address: space.spaceAddress as Address,
        abi: spaceAbi,
        functionName: 'getSubscription',
        args: [0, address],
      })

      await api.subscriptionRecord.upsertSubscription.mutate({
        spaceId: space.id,
        tradeDuration: duration,
        start: Number(info.start),
        checkpoint: Number(info.checkpoint),
        duration: Number(info.duration),
        amount: String(info.amount),
        consumed: String(info.consumed),

        type: subscriptionType,
      })

      await Promise.all([
        subscription.refetch(),
        members.refetch(),
        refetchSpaces(),
      ])

      if (isSubscribe) {
      } else {
        toast.success('Unsubscribe successful!')
      }
      setIsOpen(false)
    } catch (error) {
      console.log('=======>>>>error:', error)
      const msg = extractErrorMessage(error)
      toast.error(msg)
    } finally {
      //
    }
  }
}
