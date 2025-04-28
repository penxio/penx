'use client'

import { Badge } from '@penx/uikit/badge'
import { Skeleton } from '@penx/uikit/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@penx/uikit/table'
import { trpc } from '@penx/trpc-client'
import { format } from 'date-fns'

export function PostList() {
  const { data = [], isLoading } = trpc.creation.listAllSiteCreations.useQuery()

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
          <TableHead>Index</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Links</TableHead>
          {/* <TableHead>siteId</TableHead> */}
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((post, index) => (
          <TableRow key={index} className="hover:bg-none">
            <TableCell>{index + 1}</TableCell>
            <TableCell>{post.title}</TableCell>
            <TableCell className="flex flex-col gap-1">
              {post.site.domains.map((item) => {
                let host = `${item.domain}.penx.io`
                if (!item.isSubdomain) {
                  host = item.domain
                }
                const link = `https://${host}/creations/${post.slug}`
                return (
                  <a
                    key={item.id}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand"
                  >
                    {link}
                  </a>
                )
              })}
            </TableCell>
            {/* <TableCell>{post.siteId}</TableCell> */}
            <TableCell className="flex-1">
              {format(post.createdAt, 'yy-MM-dd')}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
