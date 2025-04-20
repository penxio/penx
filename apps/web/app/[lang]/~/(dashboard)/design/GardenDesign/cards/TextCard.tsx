'use client'

import { Dispatch, SetStateAction } from 'react'
import { PlateEditor } from '@penx/editor/plate-editor'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { Input } from '@penx/uikit/ui/input'
import { useSite } from '@penx/hooks/useSite'
import { editorDefaultValue } from '@penx/constants'
import { LayoutItem } from '@penx/types'
import { trpc } from '@penx/trpc-client'
import { TextareaAutosize } from '@udecode/plate-caption/react'
import { produce } from 'immer'
import { useDebouncedCallback } from 'use-debounce'
import { useThemeName } from '../../hooks/useThemeName'

interface Props {
  layoutItem: LayoutItem
  layout: LayoutItem[]
  setLayout: Dispatch<SetStateAction<LayoutItem[]>>
}

export function TextCard({ layoutItem, layout, setLayout }: Props) {
  const { refetch } = useSite()
  const site = useSiteContext()
  const { themeName } = useThemeName()
  const { isPending, mutateAsync } = trpc.site.updateSite.useMutation()
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

  const value = Array.isArray(layoutItem.props?.text)
    ? layoutItem.props?.text
    : editorDefaultValue
  return (
    <div className="flex h-full w-full p-2">
      <PlateEditor
        value={value}
        editorProps={{
          onMouseDown: (e: any) => {
            e.stopPropagation()
            // e.preventDefault()
          },
          onTouchStart: (e: any) => {
            e.stopPropagation()
            e.preventDefault()
          },
        }}
        onChange={(v) => {
          updateProps({
            ...layoutItem.props,
            text: v,
          })
        }}
      />
      {/* <TextareaAutosize
        placeholder="Write something..."
        className="w-full min-h-28 p-3 bg-foreground/5 rounded-xl resize-none"
        value={layoutItem.props?.text || ''}
        onChange={async (e) => {
          updateProps({
            ...layoutItem.props,
            text: e.target.value,
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
      /> */}
    </div>
  )
}
