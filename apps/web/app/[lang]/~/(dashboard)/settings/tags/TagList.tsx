'use client'

import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useSiteTags } from '@/hooks/useSiteTags'
import { useSubscribers } from '@/hooks/useSubscribers'
import { api } from '@/lib/trpc'
import { Trans } from '@lingui/react/macro'
import { Site } from '@penx/db/client'
import { format } from 'date-fns'
import { Edit3Icon } from 'lucide-react'
import { toast } from 'sonner'
import { TagDialog } from './TagDialog/TagDialog'
import { useTagDialog } from './TagDialog/useTagDialog'

interface Props {}

export function TagList({}: Props) {
  const { data = [], isLoading, refetch } = useSiteTags()
  const { setState } = useTagDialog()

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
    <>
      <TagDialog />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Trans>Name</Trans>
            </TableHead>
            <TableHead>
              <Trans>Creation counts</Trans>
            </TableHead>
            <TableHead>
              <Trans>Created date</Trans>
            </TableHead>
            <TableHead>
              <Trans>Operation</Trans>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.creationCount}</TableCell>
              <TableCell>{format(item.createdAt, 'yyyy/MM/dd')}</TableCell>
              <TableCell className="flex items-center gap-1">
                <ConfirmDialog
                  title={`Delete tag: ${item.name}`}
                  content="All tags in post will be deleted, are you sure you want to delete this tag?"
                  tooltipContent={<Trans>Delete tag</Trans>}
                  onConfirm={async () => {
                    await api.tag.deleteTag.mutate({
                      tagId: item.id,
                    })
                    await refetch()
                    toast.success('Tag deleted successfully!')
                  }}
                />

                <Edit3Icon
                  size={16}
                  className="cursor-pointer"
                  onClick={() => {
                    setState({
                      isOpen: true,
                      tag: item,
                      index,
                    })
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
