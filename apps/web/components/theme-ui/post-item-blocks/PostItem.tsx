import { Creation, PostListStyle } from '@/lib/theme.types'
import { PostItemCard } from './PostItemCard'
import { PostItemSimple } from './PostItemSimple'

interface PostItemProps {
  postListStyle: PostListStyle
  creation: Creation
}

export function PostItem({ creation, postListStyle }: PostItemProps) {
  if (postListStyle === PostListStyle.CARD) {
    return <PostItemCard creation={creation} />
  }
  return <PostItemSimple creation={creation} />
}
