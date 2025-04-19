'use client'

import { Dispatch, SetStateAction } from 'react'
import { useSiteContext } from '@/components/SiteContext'
import { Input } from '@penx/uikit/ui/input'
import { useSite } from '@/hooks/useSite'
import { LayoutItem } from '@penx/types'
import { trpc } from '@penx/trpc-client'
import { produce } from 'immer'
import { useDebouncedCallback } from 'use-debounce'
import { useThemeName } from '../../hooks/useThemeName'

interface Props {
  layoutItem: LayoutItem
  layout: LayoutItem[]
  setLayout: Dispatch<SetStateAction<LayoutItem[]>>
}

export function TitleCard({ layoutItem, layout, setLayout }: Props) {
  const { refetch } = useSite()
  const site = useSiteContext()
  const { themeName } = useThemeName()
  const { mutateAsync } = trpc.site.updateSite.useMutation()
  const themeConfig = (site.themeConfig || {}) as Record<string, any>

  const debouncedUpdate = useDebouncedCallback(
    async (newThemeConfig: any) => {
      await mutateAsync({
        id: site.id,
        themeConfig: newThemeConfig,
      })
      await refetch()
    },
    // delay in ms
    200,
  )

  const updateProps = async (data: any) => {
    const newLayout = produce(layout, (draft) => {
      for (const item of draft) {
        if (item.i === layoutItem.i) {
          item.props = data
        }
      }
    })

    setLayout(newLayout)

    const newThemeConfig = produce(themeConfig, (draft) => {
      if (!draft?.[themeName]) draft[themeName] = {}
      draft[themeName].layout = newLayout
    })

    debouncedUpdate(newThemeConfig)
  }
  return (
    <div className="flex h-full w-full items-center pl-2">
      <div className="h-full w-[50%] overflow-hidden border-r">
        <Input
          variant="unstyled"
          placeholder="Add a title..."
          className="text-2xl font-bold"
          value={layoutItem.props?.title || ''}
          onChange={async (e) => {
            updateProps({
              ...layoutItem.props,
              title: e.target.value,
            })
          }}
          onMouseDown={(e) => {
            e.stopPropagation()
            // e.preventDefault()
          }}
          onTouchStart={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
        />
        <Input
          variant="unstyled"
          placeholder="Subtitle..."
          className="w-96"
          value={layoutItem.props?.subtitle || ''}
          onChange={async (e) => {
            updateProps({
              ...layoutItem.props,
              subtitle: e.target.value,
            })
          }}
          onMouseDown={(e) => {
            e.stopPropagation()
            // e.preventDefault()
          }}
          onTouchStart={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
        />
      </div>
    </div>
  )
}
