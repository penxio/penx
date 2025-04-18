'use client'

import { Dispatch, SetStateAction } from 'react'
import { FileUpload } from '@/components/FileUpload'
import { useSiteContext } from '@/components/SiteContext'
import { Input } from '@/components/ui/input'
import { useSite } from '@/hooks/useSite'
import { LayoutItem } from '@/lib/theme.types'
import { trpc } from '@/lib/trpc'
import { produce } from 'immer'
import { useDebouncedCallback } from 'use-debounce'
import { useThemeName } from '../../hooks/useThemeName'

interface Props {
  layoutItem: LayoutItem
  layout: LayoutItem[]
  setLayout: Dispatch<SetStateAction<LayoutItem[]>>
}

export function ImageCard({ layoutItem, layout, setLayout }: Props) {
  const { refetch } = useSite()
  const site = useSiteContext()
  const { themeName } = useThemeName()
  const { isPending, mutateAsync } = trpc.site.updateSite.useMutation()
  const themeConfig = (site.themeConfig || {}) as Record<string, any>

  const updateProps = async (url: string) => {
    const newLayout = produce(layout, (draft) => {
      for (const item of draft) {
        if (item.i === layoutItem.i) {
          item.props = { url }
        }
      }
    })

    setLayout(newLayout)

    const newThemeConfig = produce(themeConfig, (draft) => {
      if (!draft?.[themeName]) draft[themeName] = {}
      draft[themeName].layout = newLayout
    })

    await mutateAsync({
      id: site.id,
      themeConfig: newThemeConfig,
    })
    await refetch()
  }
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <FileUpload
        className="bg-background absolute bottom-0 left-0 right-0 top-0 h-full w-full"
        height={1000}
        width={1000}
        value={layoutItem?.props?.url || ''}
        editIconClassName="bottom-1 top-auto"
        imageClassName="object-cover"
        onChange={(v) => {
          updateProps(v)
        }}
      />
    </div>
  )
}
