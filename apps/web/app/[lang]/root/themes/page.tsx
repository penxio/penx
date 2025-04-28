import { Globe } from 'lucide-react'
import { Badge } from '@penx/uikit/badge'
import { ThemeList } from './ThemeList'
import { ThemeSlogan } from './ThemeSlogan'

// export const runtime = 'edge'

export const dynamic = 'force-static'

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center gap-8 pb-20 pt-20">
      {/* <ThemeSlogan /> */}
      <ThemeList />
    </div>
  )
}
