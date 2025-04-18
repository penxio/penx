'use client'

import { Link } from '@/lib/i18n'
import { ArrowRight, Bitcoin } from 'lucide-react'

export function EnableWeb3Entry() {
  return (
    <Link
      href="/~/create-space"
      className="bg-foreground/5 hover:bg-foreground/10 mt-2 flex cursor-pointer items-center justify-between rounded-lg p-3 transition-all"
    >
      <div className="text-foreground/80 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <div className="text-base font-bold">Enable Web3</div>
        </div>
        <ul className="text-foreground/60 list-inside list-disc text-xs leading-normal">
          <li>Tokenize your blog</li>
          <li>Enable blog membership</li>
          <li>Make post collectible</li>
        </ul>
      </div>
      <ArrowRight size={20} className="text-foreground/50 shrink-0" />
    </Link>
  )
}
