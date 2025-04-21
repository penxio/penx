'use client'

import { useState } from 'react'
import { Trans } from '@lingui/react'
import { CreationStatus } from '@penx/constants'
import { useAreaCreationsContext } from '@penx/contexts/AreaCreationsContext'
import { Label } from '@penx/uikit/ui/label'
import { Switch } from '@penx/uikit/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@penx/uikit/ui/table'
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
        <Label htmlFor="only-published">
          <Trans id="Only published"></Trans>
        </Label>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Trans id="User"></Trans>
            </TableHead>
            <TableHead>
              <Trans id="Link"></Trans>
            </TableHead>
            <TableHead>
              <Trans id="Date"></Trans>
            </TableHead>
            <TableHead>
              <Trans id="Operation"></Trans>
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
