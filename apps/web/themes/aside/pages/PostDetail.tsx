import { ReactNode } from 'react'
import { PostPageWidget } from '@/components/theme-ui/PostPageWidget'
import { Creation, Site } from '@/lib/theme.types'

interface Props {
  site: Site
  creation: Creation
  children: ReactNode
  className?: string
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export function PostDetail(props: Props) {
  return <PostPageWidget {...props} titleClassName="" />
}
