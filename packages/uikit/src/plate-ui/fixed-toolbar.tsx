'use client'

import { withCn } from '@udecode/cn'
import { Toolbar } from './toolbar'

export const FixedToolbar = withCn(
  Toolbar,
  'scrollbar-hide border-foreground/10 bg-background/95 supports-backdrop-blur:bg-background/60 sticky left-0 top-0 z-50 w-full justify-between overflow-x-auto rounded-xl border p-1 backdrop-blur-sm',
)
