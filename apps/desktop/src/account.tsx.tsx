import { Box } from '@fower/react'
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'uikit'
import { WalletInfo } from './WalletInfo'

export function Account() {
  const { address = '' } = useAccount()
  const { disconnect } = useDisconnect()

  const name = address.slice(0, 3) + '...' + address.slice(-3)
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger asChild cursorPointer>
        <Box cursorPointer toCenterY gap1 bgNeutral100 px2 py2 roundedLG>
          <Avatar size={24}>
            <AvatarFallback
              bgGradientX={['red500', 'orange500', 'yellow400']}
              borderNone
            ></AvatarFallback>
          </Avatar>
          {address && <Box neutral500>{name}</Box>}
        </Box>
      </PopoverTrigger>
      <PopoverContent w-340 p3>
        <WalletInfo />
        <Button onClick={() => disconnect()}>Disconnect</Button>
      </PopoverContent>
    </Popover>
  )
}
