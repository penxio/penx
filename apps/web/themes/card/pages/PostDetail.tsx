import { ReactNode } from 'react'
import { PostPageWidget } from '@/components/theme-ui/PostPageWidget'
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
  return (
    <div className="mx-auto mt-20 w-full lg:max-w-3xl">
      <PostPageWidget {...props} />
    </div>
  )
}
