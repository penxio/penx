'use client'

import { Dispatch, SetStateAction } from 'react'
import { Creation } from '@penx/db/client'
import { MessageCircle } from 'lucide-react'

interface Props {
  creation: Creation
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export function CommentAmount({ creation, setIsOpen }: Props) {
  return (
    <div
      className="text-foreground flex cursor-pointer items-center justify-between gap-1 opacity-70 hover:opacity-100"
      onClick={() => setIsOpen(true)}
    >
      <MessageCircle size={20} />
      <div>{creation.commentCount}</div>
    </div>
  )
}
