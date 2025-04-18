'use client'

import { Creation } from '@/lib/theme.types'

interface Props {
  creation: Creation
  receivers?: string[]
}

export function PostActions({ creation, receivers = [] }: Props) {
  return null

  // return (
  //   <div className="flex items-center justify-between text-sm">
  //     <div className="flex items-end gap-4">
  //       {/* <CollectorsDialog post={post} /> */}
  //       {/* <TippersDialog post={post} receivers={receivers} /> */}
  //       <CommentSheet post={post} />
  //     </div>
  //     <div className="flex items-center gap-1">
  //       {/* <TipTokenButton post={post} receivers={receivers} /> */}
  //       {typeof post.creationId === 'number' && <CollectButton post={post} />}
  //     </div>
  //   </div>
  // )
}
