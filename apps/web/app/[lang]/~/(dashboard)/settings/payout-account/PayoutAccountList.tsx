'use client'

import { LoadingDots } from '@penx/uikit/loading-dots'
import { Button } from '@penx/uikit/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@penx/uikit/table'
import { api, trpc } from '@penx/trpc-client'
import { TransferMethod } from '@penx/db/client'
import { format } from 'date-fns'
import { Edit3, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { usePayoutAccountDialog } from './PayoutAccountDialog/usePayoutAccountDialog'

interface Props {}

export function PayoutAccountList({}: Props) {
  const { setState } = usePayoutAccountDialog()
  const { data = [], isLoading } = trpc.payoutAccount.list.useQuery()

  if (isLoading) {
    return (
      <div>
        <LoadingDots className="bg-foreground" />
      </div>
    )
  }

  if (!data?.length)
    return (
      <div className="text-foreground/50 mt-2">No payout accounts found.</div>
    )
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Edit</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item, index) => {
            let account: any
            if (item.transferMethod === TransferMethod.WALLET) {
              const info = item.info as any
              account = info?.address
            }

            return (
              <TableRow key={index}>
                <TableCell>{item.transferMethod}</TableCell>
                <TableCell>{account}</TableCell>
                <TableCell>{format(item.createdAt, 'yyyy-MM-dd')}</TableCell>
                <TableCell className="text-foreground/70 flex items-center gap-1">
                  <Edit3
                    size={18}
                    className="cursor-pointer"
                    onClick={() => {
                      setState({
                        isOpen: true,
                        payoutAccount: item,
                        index,
                      })
                    }}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}
