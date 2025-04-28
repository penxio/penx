import { Globe } from 'lucide-react'
import { Badge } from '@penx/uikit/ui/badge'
import { PartnerProgram } from './PartnerProgram'

// export const runtime = 'edge'

export const dynamic = 'force-static'

export default function HomePage() {
  return (
    <div className="flex h-full flex-1 flex-col justify-center gap-8  pb-20 pt-20">
      <PartnerProgram />
    </div>
  )
}
