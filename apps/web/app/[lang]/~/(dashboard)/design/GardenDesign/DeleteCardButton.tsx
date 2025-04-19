'use client'

import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@penx/ui/components/button'
import { useSite } from '@/hooks/useSite'
import { LayoutItem } from '@/lib/theme.types'
import { trpc } from '@/lib/trpc'
import { produce } from 'immer'
import { Trash2 } from 'lucide-react'
import { useThemeName } from '../hooks/useThemeName'
import { useDesignContext } from './hooks/DesignContext'
import { getDisableDragProps } from './lib/getDisableDragProps'

export function DeleteCardButton({ item }: { item: LayoutItem }) {
  const { layout, setLayout } = useDesignContext()
  const { refetch } = useSite()
  const site = useSiteContext()
  const { themeName } = useThemeName()
  const themeConfig = (site.themeConfig || {}) as Record<string, any>
  const { mutateAsync } = trpc.site.updateSite.useMutation()

  return (
    <Button
      variant="outline"
      size="icon"
      className="absolute -left-2 -top-2 z-50 hidden size-8 border-none shadow group-hover:flex"
      onClick={async () => {
        const newLayout = layout.filter((i) => i.i !== item.i)
        setLayout(newLayout)
        const newThemeConfig = produce(themeConfig, (draft) => {
          if (!draft?.[themeName]) draft[themeName] = {}
          draft[themeName].layout = newLayout
        })

        await mutateAsync({
          id: site.id,
          themeConfig: newThemeConfig,
        })
        refetch()
      }}
      {...getDisableDragProps()}
    >
      <Trash2 size={16} />
    </Button>
  )
}
