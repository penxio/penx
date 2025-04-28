import { ReactNode } from 'react'
import { PostPageWidget } from '@penx/components/PostPageWidget'
import { Creation, Site } from '@penx/types'

interface Props {
  site: Site
  creation: Creation
  children: ReactNode
  className?: string
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export function PostDetail(props: Props) {
  // console.log('======props:', props.creation)

  return <PostPageWidget {...props} />
}
