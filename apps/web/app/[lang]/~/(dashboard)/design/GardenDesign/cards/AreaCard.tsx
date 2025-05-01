'use client'

import { Dispatch, SetStateAction } from 'react'
import { Trans } from '@lingui/react'
import { produce } from 'immer'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { useAreas } from '@penx/hooks/useAreas'
import { useSite } from '@penx/hooks/useSite'
import { Link } from '@penx/libs/i18n'
import { trpc } from '@penx/trpc-client'
import { LayoutItem } from '@penx/types'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@penx/uikit/select'
import { useThemeName } from '../../hooks/useThemeName'

interface Props {
  layoutItem: LayoutItem
  layout: LayoutItem[]
  setLayout: Dispatch<SetStateAction<LayoutItem[]>>
}

export function AreaCard({ layoutItem, layout, setLayout }: Props) {
  const { refetch } = useSite()
  const site = useSiteContext()
  const { areas = [] } = useAreas()
  const { themeName } = useThemeName()
  const { isPending, mutateAsync } = trpc.site.updateSite.useMutation()
  const themeConfig = (site.themeConfig || {}) as Record<string, any>
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-2">
      <div className="text-2xl font-bold">
        <Trans id="Area"></Trans>
      </div>

      <Select
        onValueChange={async (v) => {
          const newLayout = produce(layout, (draft) => {
            for (const item of draft) {
              if (item.i === layoutItem.i) {
                item.props = { areaId: v }
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
          //
        }}
        defaultValue={layoutItem?.props?.areaId || ''}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select an area" />
        </SelectTrigger>

        <SelectContent>
          {areas.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
