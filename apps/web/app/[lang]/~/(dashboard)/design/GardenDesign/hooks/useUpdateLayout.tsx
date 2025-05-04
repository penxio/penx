import isEqual from 'react-fast-compare'
import { Layout } from 'react-grid-layout'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { useQuerySite } from '@penx/hooks/useQuerySite'
import { trpc } from '@penx/trpc-client'
import { produce } from 'immer'
import { toast } from 'sonner'
import { useThemeName } from '../../hooks/useThemeName'
import { useDesignContext } from './DesignContext'

export function useUpdateLayout() {
  const { isMobile, layout, setLayout } = useDesignContext()
  const { refetch } = useQuerySite()
  const site = useSiteContext()
  const { themeName } = useThemeName()
  const themeConfig = (site.themeConfig || {}) as Record<string, any>
  const { mutateAsync } = trpc.site.updateSite.useMutation()

  return async (newLayout: Layout[]) => {
    const updatedLayout = produce(layout, (draft) => {
      for (const item of draft) {
        const find = newLayout.find((i) => i.i === item.i)!
        item.x = isMobile ? [find.x, item.x[1]] : [item.x[0], find.x]
        item.y = isMobile ? [find.y, item.y[1]] : [item.y[0], find.y]
      }
    })

    if (isEqual(updatedLayout, layout)) return
    setLayout(updatedLayout)

    const newThemeConfig = produce(themeConfig, (draft) => {
      draft[themeName].layout = updatedLayout
    })

    // console.log('=======newThemeConfig:', JSON.stringify(newThemeConfig))

    await mutateAsync({
      id: site.id,
      themeConfig: newThemeConfig,
    })
    toast.success('Layout saved successfully!')
    refetch()
  }
}
