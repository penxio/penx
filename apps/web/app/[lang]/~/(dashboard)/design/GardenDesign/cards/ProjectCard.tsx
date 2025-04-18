'use client'

import { Dispatch, SetStateAction } from 'react'
import { useSiteContext } from '@/components/SiteContext'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSite } from '@/hooks/useSite'
import { Link } from '@/lib/i18n'
import { LayoutItem } from '@/lib/theme.types'
import { trpc } from '@/lib/trpc'
import { Trans } from '@lingui/react/macro'
import { produce } from 'immer'
import { useThemeName } from '../../hooks/useThemeName'

interface Props {
  layoutItem: LayoutItem
  layout: LayoutItem[]
  setLayout: Dispatch<SetStateAction<LayoutItem[]>>
}

export function ProjectCard({ layoutItem, layout, setLayout }: Props) {
  const { refetch } = useSite()
  const site = useSiteContext()
  const { themeName } = useThemeName()
  const { isPending, mutateAsync } = trpc.site.updateSite.useMutation()
  const themeConfig = (site.themeConfig || {}) as Record<string, any>
  const { data = [], isLoading } = trpc.creation.listProjects.useQuery({})

  if (isLoading) return null

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-2">
      <div className="text-2xl font-bold">
        <Trans>Project</Trans>
      </div>

      <Select
        onValueChange={async (v) => {
          const newLayout = produce(layout, (draft) => {
            for (const item of draft) {
              if (item.i === layoutItem.i) {
                item.props = { projectId: v }
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
        defaultValue={layoutItem?.props?.projectId || ''}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a project" />
        </SelectTrigger>

        <SelectContent>
          {data.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
