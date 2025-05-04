import { produce } from 'immer'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { GardenCardType, SocialType } from '@penx/constants'
import { useQuerySite } from '@penx/hooks/useQuerySite'
import { trpc } from '@penx/trpc-client'
import { CreationType } from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { useThemeName } from '../../hooks/useThemeName'
import { useDesignContext } from './DesignContext'

export function useAddCard() {
  const { isMobile, layout, setLayout } = useDesignContext()
  const { refetch } = useQuerySite()
  const site = useSiteContext()
  const { themeName } = useThemeName()
  const themeConfig = (site.themeConfig || {}) as Record<string, any>

  const { mutateAsync } = trpc.site.updateSite.useMutation()
  return async (type: any) => {
    let w = [2, 2]
    let h = [2, 2]
    if (type === CreationType.ARTICLE) {
      w = [4, 4]
      h = [4, 4]
    }

    if (
      [
        CreationType.AUDIO,
        GardenCardType.COMMENTS,
        GardenCardType.COMMENTS,
      ].includes(type)
    ) {
      w = [4, 4]
      h = [2, 2]
    }

    if (type === GardenCardType.TITLE) {
      w = [4, 8]
      h = [1, 1]
    }

    if (type === GardenCardType.AREA) {
      w = [2, 2]
      h = [2, 2]
    }

    if (Object.keys(SocialType).includes(type)) {
      w = [2, 2]
      h = [1, 1]
    }

    const maxY_mobile = layout?.length
      ? Math.max(...layout.map((i) => i.y[0]!))
      : 0
    const maxY_PC = layout.length ? Math.max(...layout.map((i) => i.y[1]!)) : 0
    const maxY = isMobile ? maxY_mobile : maxY_PC
    console.log('===maxY:', maxY)

    const newLayout = [
      ...layout,
      {
        i: uniqueId(),
        x: [0, 0],
        y: [maxY + h[0], maxY + h[1]],
        w: w,
        h: h,
        type: type,
      },
    ]

    // console.log('newLayout====+>>:', newLayout)

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
}
