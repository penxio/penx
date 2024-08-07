'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useMembers } from '@/hooks/useMembers'
import { precision } from '@/lib/math'
import { Space } from '@prisma/client'

interface Props {
  space: Space
}

export function MemberList({ space }: Props) {
  const { members, isLoading } = useMembers(space.id)

  if (isLoading) return null

  if (!members?.length) {
    return <div className="text-neutral-500">No members yet!</div>
  }

  return (
    <div className="space-y-3 mt-4">
      {members.map((member) => (
        <div key={member.id} className="flex justify-between">
          <div className="flex gap-2 items-center">
            <Avatar>
              <AvatarImage src="" alt="" />
              <AvatarFallback>{member.user.address.slice(-2)}</AvatarFallback>
            </Avatar>
            <div>{member.user.address}</div>
          </div>
          <div>
            has <span className="font-bold">{member.amount}</span> Keys
          </div>
        </div>
      ))}
    </div>
  )
}
