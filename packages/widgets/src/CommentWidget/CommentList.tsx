'use client'

import { useState } from 'react'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { useSession } from '@penx/session'
import { trpc } from '@penx/trpc-client'
import { Comment, User } from '@penx/db/client'
import { ArrowRight, MessageCircle, Trash2 } from 'lucide-react'
import { CommentInput } from './CommentInput'
import { CommentUserAvatar } from './CommentUserAvatar'

interface Props {
  creationId: string
  isInPage: boolean
}

export function CommentList({ creationId, isInPage }: Props) {
  const {
    data: comments = [],
    isLoading,
    refetch,
  } = trpc.comment.listByCreationId.useQuery(creationId)

  const { isPending, mutateAsync: listRepliesByCommentId } =
    trpc.comment.listRepliesByCommentId.useMutation()
  const [showReplyInput, setShowReplyInput] = useState<string>('')
  const [showReplies, setShowReplies] = useState<string>('')
  const { session } = useSession()

  const onReplies = async (
    commentId: string,
    replyCount: number,
    showReplies: string,
  ) => {
    if (!replyCount) {
      return
    }

    if (showReplies) {
      setShowReplies('')

      return
    }

    try {
      const data = await listRepliesByCommentId(commentId)
      setShowReplies(commentId)
    } catch (error) {
      console.error('Error fetching replies:', error)
    }
  }

  const getParentUser = (comment: Comment) => {
    return comments.find((item) => item.id === comment.parentId)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-10 items-center justify-center">
        <LoadingDots className="bg-foreground" />
      </div>
    )
  }

  if (!comments.length) {
    return (
      <div className="">
        <p className="text-foreground/40">No comments yet.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment, index) => {
        const contentJSX = <div className="text-[15px]">{comment.content}</div>

        const authorJSX = (
          <div className="flex items-center gap-1">
            <div className="text-sm font-bold">{comment.user?.displayName}</div>

            {!!comment.parentId && (
              <>
                <ArrowRight size={12} className="text-foreground/40" />
                <div className="text-sm font-bold">
                  {getParentUser(comment)?.user?.displayName}
                </div>
              </>
            )}
          </div>
        )

        const timeJSX = (
          <div className="text-foreground/50 text-xs">
            {comment.createdAt.toLocaleDateString()}
          </div>
        )

        return (
          <div key={comment.id} className="group my-2 space-y-2 rounded">
            <div className="text-foreground/80 flex items-center gap-2">
              <CommentUserAvatar user={comment.user} />
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {authorJSX}
                    {timeJSX}
                  </div>
                  <div className="text-foreground/50 hidden items-center gap-1 transition-all group-hover:flex">
                    <MessageCircle
                      size={16}
                      className="hover:text-foreground/70 cursor-pointer"
                      onClick={() =>
                        setShowReplyInput(showReplyInput ? '' : comment.id)
                      }
                    />
                  </div>
                </div>
                {contentJSX}
              </div>
            </div>

            {showReplyInput === comment.id && (
              <CommentInput
                creationId={comment.creationId}
                parentId={comment.id}
                onCancel={() => {
                  setShowReplyInput('')
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
