import { Box } from '@fower/react'
import { useAccount, useBalance, useReadContract } from 'wagmi'
import { inkAbi, pointFacetAbi } from '@penx/abi'
import { precision } from '@penx/math'
import { addressMap } from '@penx/wagmi'

export function MyPoint() {
  const { address } = useAccount()
  const { data, ...rest } = useReadContract({
    address: addressMap.INK,
    abi: inkAbi,
    functionName: 'balanceOf',
    args: [address!],
  })

  const { data: point } = useReadContract({
    address: addressMap.Diamond,
    abi: pointFacetAbi,
    functionName: 'accountPoint',
  })

  const { data: ethBalance } = useBalance({
    // address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    // address: addressMap.Believer,
    // address: addressMap.Diamond,
    address: addressMap.DaoVault,
  })

  console.log('point================', point, 'ethBalance:', ethBalance)

  if (typeof data === 'undefined') return null

  return (
    <Box column gap2>
      <Box gray500>My Points</Box>
      <Box text3XL fontBold>
        {precision.toDecimal(data)} PXP
      </Box>
    </Box>
  )
}
