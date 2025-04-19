'use client'

import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@penx/uikit/ui/button'
import { api } from '@penx/trpc-client'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

function downloadFile(data: any, fileName: string) {
  const jsonData = new Blob([JSON.stringify(data)], {
    type: 'application/json',
  })
  const jsonURL = URL.createObjectURL(jsonData)

  const link = document.createElement('a')
  link.href = jsonURL
  link.download = fileName

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function ExportSubscribers() {
  const site = useSiteContext()
  const { isPending, mutateAsync: exportPosts } = useMutation({
    mutationKey: ['export-subscribers'],
    mutationFn: async () => {
      const subscribers = await api.subscriber.all.query({ siteId: site.id })
      const emailData = subscribers.map((subscriber) => ({
        email: subscriber.email,
        createdAt: subscriber.createdAt,
      }))
      downloadFile(emailData, 'subscribers.json')
      toast.success('Subscribers exported successfully!')
    },
  })

  return (
    <div className="flex items-center justify-between">
      <div className="font-semibold">Subscribers</div>
      <Button disabled={isPending} onClick={async () => await exportPosts()}>
        Export
      </Button>
    </div>
  )
}

function ExportPosts() {
  const site = useSiteContext()
  const { isPending, mutateAsync: exportPosts } = useMutation({
    mutationKey: ['export-posts'],
    mutationFn: async () => {
      const creations = await api.creation.listAllCreations.query({
        siteId: site.id,
      })
      downloadFile(creations, 'posts.json')
      toast.success('Posts exported successfully!')
    },
  })

  return (
    <div className="flex items-center justify-between">
      <div className="font-semibold">Posts</div>
      <Button disabled={isPending} onClick={async () => await exportPosts()}>
        Export
      </Button>
    </div>
  )
}

export function ExportCard() {
  return (
    <div>
      <h2 className="text-2xl font-semibold">Export</h2>
      <div className="text-foreground/60 mb-4">
        Export your data: subscribers, posts. everything else.
      </div>
      <div className="space-y-1">
        <ExportPosts />
        <ExportSubscribers />
      </div>
    </div>
  )
}
