'use client'

import { ConfirmDialog } from '@penx/widgets/ConfirmDialog'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { Button } from '@penx/uikit/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@penx/uikit/card'
import { api } from '@penx/trpc-client'
import { toast } from 'sonner'

interface Props {}

export function DeletePostsCard({}: Props) {
  const site = useSiteContext()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete site posts</CardTitle>
        <CardDescription>
          This is useful if something goes wrong during the import process.
          Please note that it will delete all your posts, including those you
          created manually.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ConfirmDialog
          title="Delete all posts?"
          content="Are you sure you want to delete all posts?"
          tooltipContent=""
          onConfirm={async () => {
            await api.creation.deleteSitePosts.mutate({ siteId: site.id })
            toast.success('All posts deleted successfully!')
          }}
        >
          <Button variant="destructive">Delete all posts</Button>
        </ConfirmDialog>
      </CardContent>
    </Card>
  )
}
