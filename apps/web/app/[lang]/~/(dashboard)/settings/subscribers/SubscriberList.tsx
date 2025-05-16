'use client'

import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { format } from 'date-fns'
import { RefreshCw, Search, X } from 'lucide-react'
import { SubscriberStatus } from '@penx/db/client'
import { useSubscribers } from '@penx/hooks/useSubscribers'
import { api } from '@penx/trpc-client'
import { Badge } from '@penx/uikit/badge'
import { Button } from '@penx/uikit/button'
import { Input } from '@penx/uikit/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@penx/uikit/select'
import { Skeleton } from '@penx/uikit/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@penx/uikit/table'
import { cn } from '@penx/utils'
import { ConfirmDialog } from '@penx/widgets/ConfirmDialog'
import { AddSubscriberDialog } from './AddSubscriberDialog/AddSubscriberDialog'

const statusConfig = {
  [SubscriberStatus.ACTIVE]: {
    label: 'Active',
    className: 'bg-green-100 text-green-800',
  },
  [SubscriberStatus.PENDING]: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-800',
  },
  [SubscriberStatus.UNSUBSCRIBED]: {
    label: 'Unsubscribed',
    className: 'bg-red-100 text-red-800',
  },
}

export function SubscriberList() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [status, setStatus] = useState<SubscriberStatus | 'ALL'>('ALL')
  const { ref: loadMoreRef, inView } = useInView()

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useSubscribers({
    search: debouncedSearch,
    status: status === 'ALL' ? undefined : status,
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  const subscribers = data?.pages.flatMap((page) => page.items) ?? []

  return (
    <>
      <div className="mb-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search by email..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          value={status}
          onValueChange={(value) =>
            setStatus(value as SubscriberStatus | 'ALL')
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            {Object.entries(statusConfig).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
        </Button>
        <AddSubscriberDialog />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array(5)
            .fill('')
            .map((_, i) => (
              <Skeleton key={i} className="h-[52px] w-full" />
            ))}
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date subscribed</TableHead>
                <TableHead>Operation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.map((item, index) => {
                const status = statusConfig[item.status]
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>
                      <Badge className={status.className} variant="secondary">
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(item.createdAt, 'yyyy/MM/dd')}
                    </TableCell>
                    <TableCell>
                      <ConfirmDialog
                        title="Delete subscriber"
                        content="Are you sure you want to delete this subscriber?"
                        tooltipContent="delete subscriber"
                        onConfirm={async () => {
                          await api.subscriber.delete.mutate({
                            id: item.id,
                          })
                          await refetch()
                        }}
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {hasNextPage && (
            <div ref={loadMoreRef} className="mt-4 flex justify-center">
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          )}
        </>
      )}
    </>
  )
}
