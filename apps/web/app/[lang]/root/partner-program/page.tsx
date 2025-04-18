import { Badge } from '@/components/ui/badge'
import { addressMap } from '@/lib/address'
import { Globe } from 'lucide-react'
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
