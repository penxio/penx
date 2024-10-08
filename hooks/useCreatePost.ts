import { PostType } from '@/lib/constants'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { api, trpc } from '@/lib/trpc'
import { store } from '@/store'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { postAtom } from './usePost'
import { postsAtom } from './usePosts'
import { useSpace } from './useSpace'

export function useCreatePost() {
  const { push } = useRouter()
  const { isPending, mutateAsync } = trpc.post.create.useMutation()
  const { space } = useSpace()
  const createPost = async (type: PostType) => {
    try {
      const post = await mutateAsync({ spaceId: space.id, type })
      store.set(postAtom, post as any)
      setTimeout(async () => {
        const posts = await api.post.listBySpaceId.query(space.id)
        store.set(postsAtom, posts)
      }, 0)
      push(`/~/space/${space.id}/post/${post.id}`)
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg || 'Failed to create post')
    }
  }
  return { isPending, createPost }
}
