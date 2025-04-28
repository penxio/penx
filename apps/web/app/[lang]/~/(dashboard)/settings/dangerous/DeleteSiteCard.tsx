'use client'

import { Button } from '@penx/uikit/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@penx/uikit/card'
import { useDeleteSiteDialog } from './DeleteSiteDialog/useDeleteSiteDialog'

interface Props {}

export function DeleteSiteCard({}: Props) {
  const { setIsOpen } = useDeleteSiteDialog()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete site</CardTitle>
        <CardDescription>
          The site will be permanently deleted, including its data. This action
          is irreversible and can not be undone.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="destructive" onClick={() => setIsOpen(true)}>
          Delete Site
        </Button>
      </CardContent>
    </Card>
  )
}
