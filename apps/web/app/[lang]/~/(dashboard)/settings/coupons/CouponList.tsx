'use client'

import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useCoupons } from '@/hooks/useCoupons'
import { SECONDS_PER_DAY } from '@/lib/constants'

export function CouponList() {
  const { data = [], isLoading } = useCoupons()

  if (isLoading) {
    return (
      <div className="mt-2 grid gap-4">
        {Array(5)
          .fill('')
          .map((_, i) => (
            <Skeleton key={i} className="h-[60px] rounded-lg" />
          ))}
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>duration</TableHead>
          <TableHead>Used</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{item.code}</TableCell>
            <TableCell>
              {item.duration / Number(SECONDS_PER_DAY)} days
            </TableCell>
            <TableCell>
              {item.isUsed ? (
                <Badge className="bg-foreground/50">Used</Badge>
              ) : (
                <Badge className="bg-green-500">Usable</Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
