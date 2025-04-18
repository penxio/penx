import { useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { LoadingDots } from '@/components/icons/loading-dots'
import { useLoginDialog } from '@/components/LoginDialog/useLoginDialog'
import { useSession } from '@/components/session'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc'
import { SendIcon } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

const CommentSchema = z.object({
  content: z
    .string()
    .min(1, { message: 'Comment cannot be empty.' })
    .max(1000, { message: 'Comment cannot exceed 1000 characters.' }),
})

interface Props {
  creationId: string
  // For reply
  parentId?: string
  onCancel?: () => void
}

const maxCharacters = 1000

export function CommentInput({ creationId, parentId, onCancel }: Props) {
  const site = useSiteContext()
  const { refetch } = trpc.comment.listByCreationId.useQuery(creationId)
  const [content, setContent] = useState('')
  const { isPending, mutateAsync } = trpc.comment.create.useMutation()
  const loginDialog = useLoginDialog()
  const { data: session } = useSession()
  const authenticated = !!session

  async function handleSubmit() {
    const result = CommentSchema.safeParse({ content })
    if (!result.success) {
      toast.error(result.error.issues[0].message)
      return
    }

    if (!authenticated) {
      toast.error('You need to log in to comment.')

      return
    }

    try {
      await mutateAsync({
        siteId: site.id,
        creationId: creationId,
        content,
        parentId,
      })

      setContent('')
      onCancel && onCancel()
      refetch()
      toast.success('Comment submitted successfully!')
    } catch (error) {
      console.log('Failed to submit comment.', 'color:red', error)
      toast.error('Failed to submit comment.')
    }
  }

  return (
    <div className="relative">
      <TextareaAutosize
        placeholder="Write something here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={maxCharacters}
        className="border-foreground/15 min-h-28 w-full resize-none rounded-xl border px-4 pb-8 pt-4"
      />
      <div className="text-foreground/50 absolute bottom-3 mt-2 flex w-full items-center justify-between px-2 text-sm">
        <div className="-mb-3 pl-1 text-xs">
          {content.length}/{maxCharacters}
        </div>

        <div className="flex justify-end gap-1">
          {parentId && (
            <Button
              variant="ghost"
              size="xs"
              className="h-8 w-16 rounded-lg text-xs"
              onClick={() => {
                setContent('')
                onCancel && onCancel()
              }}
            >
              <p>Cancel</p>
            </Button>
          )}

          {!authenticated ? (
            <Button
              size="xs"
              className="h-8 w-16 rounded-lg text-xs"
              onClick={() => {
                loginDialog.setIsOpen(true)
              }}
            >
              Login
            </Button>
          ) : (
            <Button
              size="xs"
              onClick={handleSubmit}
              className="h-8 w-16 rounded-lg text-xs"
            >
              {isPending ? (
                <LoadingDots />
              ) : (
                <>
                  <SendIcon size={14} />
                  <span>Send</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
