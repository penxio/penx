'use client'

import { LoadingDots } from '@/components/icons/loading-dots'
import { Button } from '@penx/ui/components/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@penx/ui/components/table'
import { api, trpc } from '@/lib/trpc'
import { cn } from '@/lib/utils'
import { Site } from '@penx/db/client'
import { format } from 'date-fns'

interface Props {
  site: Site
}

export function ProductList({ site }: Props) {
  const { data = [], isLoading } = trpc.member.list.useQuery()

  if (isLoading) {
    return (
      <div>
        <LoadingDots className="bg-foreground" />
      </div>
    )
  }
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Billing cycle</TableHead>
            <TableHead>Current period end</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => {
            return (
              <TableRow key={index}>
                <TableCell>{item.user.name}</TableCell>
                <TableCell>{item.user.email}</TableCell>
                <TableCell>{item.product.name}</TableCell>
                <TableCell>
                  <span>{(item.product.price / 100).toFixed(2)}</span>
                </TableCell>
                <TableCell>{item.sassBillingCycle}</TableCell>
                <TableCell>
                  {item.sassCurrentPeriodEnd &&
                    format(item.sassCurrentPeriodEnd, 'yyyy-MM-dd')}
                </TableCell>
                <TableCell>{format(item.createdAt, 'yyyy-MM-dd')}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}
