'use client'

import { useState } from 'react'
import { IconGoogle } from '@penx/uikit/components/icons/IconGoogle'
import { Button } from '@penx/uikit/ui/button'
import { useMyAccounts } from '@penx/hooks/useMyAccounts'
import { Link } from '@penx/libs/i18n'
import { ProviderType } from '@prisma/client'
import { ArrowRight, XIcon } from 'lucide-react'

const key = 'HAVE_IMPORTED_POSTS'

export function ImportPostEntry() {
  const [visible, setVisible] = useState(localStorage.getItem(key) !== 'true')

  if (!visible) return null

  return (
    <Link
      href="/~/settings/import-export"
      className="bg-foreground/5 hover:bg-foreground/10 mt-2 flex cursor-pointer items-center justify-between rounded-lg p-3 transition-all"
    >
      <div className="text-foreground space-y-1">
        <div className="flex items-center gap-1">
          <div className="text-base font-bold">Import posts with AI</div>
        </div>
        <div className="text-foreground/70 text-sm leading-normal">
          One-click to import posts from you blog with AI.
        </div>
        <div className="flex items-center text-xs">
          <span className="text-foreground/50 mr-1">I have imported</span>
          <XIcon
            size={14}
            className="text-foreground/60 hover:text-foreground/90"
            onClick={() => {
              localStorage.setItem(key, 'true')
              setVisible(false)
            }}
          ></XIcon>
        </div>
      </div>
      <ArrowRight size={20} className="text-foreground/50 shrink-0" />
    </Link>
  )
}
