'use client'

import { useState } from 'react'
import { useAreaCreationsContext } from '@/components/AreaCreationsContext'
import { Label } from '@penx/ui/components/label'
import { Switch } from '@penx/ui/components/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@penx/ui/components/table'
import { CreationStatus } from '@/lib/constants'
import { Trans } from '@lingui/react/macro'
import { PostItem } from './PostItem'

interface PostListProps {}

export function PostList({}: PostListProps) {
  const [published, setPublished] = useState(false)
  const data = useAreaCreationsContext()

  const creations = data.filter((item) =>
    published ? item.status === CreationStatus.PUBLISHED : true,
  )

  if (!creations.length) {
    return <div className="text-foreground/60">No creations yet.</div>
  }

  return (
    <div>
      <div className="flex items-center justify-end gap-1">
        <Switch
          id="only-published"
          checked={published}
          onCheckedChange={(checked) => {
            setPublished(checked)
          }}
        />
        <Label htmlFor="only-published">Only published</Label>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Trans>User</Trans>
            </TableHead>
            <TableHead>
              <Trans>Link</Trans>
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
            return <PostItem key={item.id} creation={item} />
          })}
        </TableBody>
      </Table>
    </div>
  )
}
