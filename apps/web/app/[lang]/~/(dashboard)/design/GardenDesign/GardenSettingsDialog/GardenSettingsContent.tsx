'use client'

import { useState } from 'react'
import { useSiteContext } from '@/components/SiteContext'
import { useSite } from '@/hooks/useSite'
import { CardStyle } from '@penx/constants'
import { trpc } from '@penx/trpc-client'
import { Trans } from '@lingui/react/macro'
import { produce } from 'immer'
import { useThemeName } from '../../hooks/useThemeName'
import { useDesignContext } from '../hooks/DesignContext'
import { CardStyleSelect } from './CardStyleSelect'
import { useGardenSettingsDialog } from './useGardenSettingsDialog'

interface Props {}

export function GardenSettingsContent({}: Props) {
  const { refetch } = useSite()
  const { layoutItem } = useGardenSettingsDialog()
  const { isMobile, layout, setLayout } = useDesignContext()
  const site = useSiteContext()
  const { themeName } = useThemeName()
  const themeConfig = (site.themeConfig || {}) as Record<string, any>
  const { mutateAsync } = trpc.site.updateSite.useMutation()
  const [cardStyle, setCardStyle] = useState<CardStyle>(
    (layoutItem?.cardStyle as any) || CardStyle.SHADOW,
  )

  const size = 10

  const pcSizes = [
    [4, 2],
    [2, 4],
    [4, 4],
    [8, 4],
  ]

  const mobileSizes = [
    [1, 1],
    [2, 1],
    [1, 2],
    [2, 2],
  ]

  const sizes = [...mobileSizes, ...pcSizes]

  async function onSelectLayout(w: number, h: number) {
    const newLayout = produce(layout, (draft) => {
      for (const item of draft) {
        if (item.i === layoutItem.i) {
          item.w = isMobile ? [w, item.w[1]] : [item.w[0], w]
          item.h = isMobile ? [h, item.h[1]] : [item.h[0], h]
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
    refetch()
  }

  async function updateCardStyle(style: CardStyle) {
    const newLayout = produce(layout, (draft) => {
      for (const item of draft) {
        if (item.i === layoutItem.i) {
          item.cardStyle = style
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
    refetch()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-center gap-2">
        {sizes.map(([w, h], index) => (
          <div
            key={index}
            className="bg-foreground/6 cursor-pointer rounded-md p-1"
            style={{ width: `${size * 9}px`, height: `${size * 9}px` }}
            onClick={() => {
              onSelectLayout(w, h)
            }}
          >
            <div
              className="shadow-xs bg-background cursor-pointer rounded"
              style={{ width: `${size * w}px`, height: `${size * h}px` }}
            />
          </div>
        ))}
      </div>

      <div>
        <div className="text-sm font-semibold">
          <Trans>Card style</Trans>
        </div>
        <CardStyleSelect
          value={cardStyle}
          onChange={(v) => {
            setCardStyle(v)
            updateCardStyle(v)
          }}
        />
      </div>
    </div>
  )
}
