'use client'

import { LoadingDots } from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { api, trpc } from '@/lib/trpc'
import { cn } from '@/lib/utils'
import { Site } from '@penx/db/client'
import { format } from 'date-fns'
import { produce } from 'immer'

interface Props {
  site: Site
}

export function OrderList({ site }: Props) {
  const { data = [], isLoading } = trpc.order.list.useQuery()

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
            <TableHead>ID</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Customer email</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => {
            return (
              <TableRow key={index}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.product.name}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>{item.customer.email}</TableCell>
                <TableCell>{format(item.createdAt, 'MM-dd')}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}
