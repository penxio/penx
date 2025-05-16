import { Dispatch, SetStateAction } from 'react'
import { produce } from 'immer'
import { useDebouncedCallback } from 'use-debounce'
import { SocialType } from '@penx/constants'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { useQuerySite } from '@penx/hooks/useQuerySite'
import { trpc } from '@penx/trpc-client'
import { LayoutItem } from '@penx/types'
import { Button } from '@penx/uikit/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@penx/uikit/dialog'
import { Input } from '@penx/uikit/input'
import { useThemeName } from '../../hooks/useThemeName'
import { useDesignContext } from '../hooks/DesignContext'
import { GardenSettingsContent } from './GardenSettingsContent'
import { useGardenSettingsDialog } from './useGardenSettingsDialog'

interface Props {}

export function GardenSettingsDialog({}: Props) {
  const { isMobile, layout, setLayout } = useDesignContext()
  const { isOpen, setIsOpen, layoutItem } = useGardenSettingsDialog()

  const { refetch } = useQuerySite()
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

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogHeader className="hidden">
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <DialogContent
        className="sm:max-w-[500px]"
        // showOverlay={false}
      >
        <DialogHeader className="hidden">
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <GardenSettingsContent />
        <div>
          {Object.keys(SocialType).includes(layoutItem?.type) && (
            <div>
              <div className="font-semibold">Url</div>
              <Input
                defaultValue={layoutItem?.props?.url || ''}
                onChange={(e) => {
                  console.log('e=======>>:', e.target.value)
                  updateProps({
                    url: e.target.value,
                  })
                }}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
