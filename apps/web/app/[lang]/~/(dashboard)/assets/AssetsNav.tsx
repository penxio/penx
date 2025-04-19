'use client'

import { useMemo, useState } from 'react'
import { Separator } from '@penx/uikit/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@penx/uikit/ui/toggle-group'
import { Link, usePathname } from '@/lib/i18n'
import { UploadAssetButton } from './UploadAssetButton'

enum DisplayMode {
  GALLERY = 'GALLERY',
  LIST = 'LIST',
  TRASH = 'TRASH',
}

export function AssetsNav() {
  const pathname = usePathname()!

  const initialMode = useMemo(() => {
    if (pathname === '/~/assets/list') return DisplayMode.LIST
    return pathname === '/~/assets/trash'
      ? DisplayMode.TRASH
      : DisplayMode.GALLERY
  }, [pathname])

  const [mode, setMode] = useState(initialMode)
  return (
    <div className="flex flex-col-reverse items-center justify-between gap-y-2 px-4 py-3 sm:flex-row">
      <div>
        <ToggleGroup
          className="bg-accent h-10 gap-3 rounded-lg p-1"
          value={mode}
          onValueChange={(v) => {
            if (v !== mode) {
              setMode(v as DisplayMode)
            }
          }}
          type="single"
        >
          <ToggleGroupItem
            className="bg-accent ring-foreground data-[state=on]:bg-background h-full flex-1 text-sm font-semibold"
            value={DisplayMode.GALLERY}
            asChild
          >
            <Link href="/~/assets">Gallery</Link>
          </ToggleGroupItem>

          <ToggleGroupItem
            asChild
            value={DisplayMode.LIST}
            className="bg-accent ring-foreground data-[state=on]:bg-background h-full flex-1 text-sm font-semibold"
          >
            <Link href="/~/assets/list">List</Link>
          </ToggleGroupItem>

          <Separator
            className="bg-background h-4"
            orientation="vertical"
          ></Separator>

          <ToggleGroupItem
            asChild
            value={DisplayMode.TRASH}
            className="bg-accent ring-foreground data-[state=on]:bg-background h-full flex-1 text-sm font-semibold"
          >
            <Link href="/~/assets/trash">Trash</Link>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div>
        <UploadAssetButton />
      </div>
    </div>
  )
}
