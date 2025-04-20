'use client'

import { ConfirmDialog } from '@penx/components/ConfirmDialog'
import { Skeleton } from '@penx/uikit/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@penx/uikit/ui/table'
import { api, trpc } from '@penx/trpc-client'
import { cn } from '@penx/utils'
import { Trans } from '@lingui/react/macro'
import { format } from 'date-fns'

export function CommentList() {
  const {
    isLoading,
    data = [],
    refetch,
  } = trpc.comment.listSiteComments.useQuery()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array(5)
          .fill('')
          .map((_, i) => (
            <Skeleton key={i} className="h-[52px] w-full" />
          ))}
      </div>
    )
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Trans>User</Trans>
          </TableHead>
          <TableHead>
            <Trans>Content</Trans>
          </TableHead>
          <TableHead>
            <Trans>Post</Trans>
          </TableHead>
          <TableHead>
            <Trans>Date</Trans>
          </TableHead>
          <TableHead>
            <Trans>Operation</Trans>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => {
          return (
            <TableRow key={item.id}>
              <TableCell>
                <div>{item.user.displayName}</div>
                <div className="text-foreground/50 text-sm">
                  {item.user.email}
                </div>
              </TableCell>
              <TableCell>{item.content}</TableCell>
              <TableCell>
                <div>{item.creation.title}</div>
              </TableCell>
              <TableCell>{format(item.createdAt, 'yyyy/MM/dd')}</TableCell>
              <TableCell>
                <ConfirmDialog
                  title="Delete subscriber"
                  content="Are you sure you want to delete this subscriber?"
                  tooltipContent="delete subscriber"
                  onConfirm={async () => {
                    await api.comment.delete.mutate(item.id)
                    await refetch()
                  }}
                />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
