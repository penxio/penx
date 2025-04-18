'use client'

import { ImportPostsButton } from './ImportPostsButton'
import { ImportSubscribersButton } from './importSubscribersButton'

function ImportSubscribers() {
  return (
    <div className="flex items-center justify-between">
      <div className="font-semibold">Subscribers</div>
      <ImportSubscribersButton />
    </div>
  )
}

function ImportPosts() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <div className="font-semibold">Posts</div>
      </div>
      <ImportPostsButton />
    </div>
  )
}

export function ImportCard() {
  return (
    <div>
      <h2 className="text-2xl font-semibold">Import</h2>
      <div className="text-foreground/60 mb-4">
        Import your data: subscribers, posts. everything else.
      </div>
      <div className="space-y-1">
        <ImportPosts />
        <ImportSubscribers />
      </div>
    </div>
  )
}
