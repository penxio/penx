'use client'

import { LoadingDots } from '@/components/icons/loading-dots'
import { useSiteContext } from '@/components/SiteContext'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { trpc } from '@/lib/trpc'
import { cn } from '@/lib/utils'
import { Trans } from '@lingui/react/macro'
import { produce } from 'immer'
import { useLoading } from './hooks/useLoading'
import { useThemeName } from './hooks/useThemeName'
import 'react-resizable'
import { Dispatch, SetStateAction } from 'react'
import { defaultLayouts } from '@/lib/constants'
import { DesignMode } from './GardenDesign/hooks/DesignContext'

const themes = [
  {
    name: 'Garden',
    value: 'garden',
  },
  {
    name: 'Minimal',
    value: 'minimal',
  },
  {
    name: 'Sue',
    value: 'sue',
  },
  {
    name: 'Aside',
    value: 'aside',
  },
  {
    name: 'Paper',
    value: 'paper',
  },
  {
    name: 'Publication',
    value: 'publication',
  },
  {
    name: 'Square',
    value: 'square',
  },
  {
    name: 'Micro',
    value: 'micro',
  },
  {
    name: 'Wide',
    value: 'wide',
  },
  {
    name: 'Maple',
    value: 'maple',
  },
  {
    name: 'Card',
    value: 'card',
  },
  {
    name: 'Docs',
    value: 'docs',
  },
]

export function ThemeDesignTitle({
  designMode,
  setDesignMode,
}: {
  designMode: DesignMode
  setDesignMode: Dispatch<SetStateAction<DesignMode>>
}) {
  const { themeName, setThemeName } = useThemeName()
  const { mutateAsync } = trpc.site.updateSite.useMutation()
  const site = useSiteContext()
  const themeConfig = (site.themeConfig || {}) as Record<string, any>
  const { setLoading } = useLoading()

  const currentDesignMode =
    themeConfig?.[themeName]?.common?.designMode || themeName === 'garden'
      ? DesignMode.GRID
      : DesignMode.CLASSIC

  return (
    <div className="fixed left-[400px] top-5 flex w-48 items-center gap-2">
      <Select
        onValueChange={async (v) => {
          setThemeName(v as any)
          setLoading(true)
          setTimeout(async () => {
            setDesignMode(currentDesignMode)
            setLoading(false)

            await mutateAsync({
              id: site.id,
              themeName: v,
            })
          })
        }}
        value={themeName}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a theme" />
        </SelectTrigger>

        <SelectContent>
          {themes.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <ToggleGroup
        className="w-auto"
        size="sm"
        value={designMode}
        onValueChange={async (v) => {
          if (!v) return
          setDesignMode(v as any)

          const newThemeConfig = produce(themeConfig, (draft) => {
            if (!draft?.[themeName]) draft[themeName] = {}
            draft[themeName].layout = draft[themeName].layout ?? defaultLayouts
            draft[themeName].common = {
              ...draft[themeName].common,
              designMode: v,
            }
          })

          await mutateAsync({
            id: site.id,
            themeConfig: newThemeConfig,
          })
        }}
        type="single"
      >
        <ToggleGroupItem className="" value={DesignMode.CLASSIC}>
          <Trans>Classic</Trans>
        </ToggleGroupItem>
        <ToggleGroupItem className="" value={DesignMode.GRID}>
          <Trans>Grid</Trans>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
