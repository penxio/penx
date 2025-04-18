import { Dispatch, SetStateAction } from 'react'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useSite } from '@/hooks/useSite'
import { SocialType } from '@/lib/constants'
import { LayoutItem } from '@/lib/theme.types'
import { trpc } from '@/lib/trpc'
import { produce } from 'immer'
import { useDebouncedCallback } from 'use-debounce'
import { useThemeName } from '../../hooks/useThemeName'
import { useDesignContext } from '../hooks/DesignContext'
import { GardenSettingsContent } from './GardenSettingsContent'
import { useGardenSettingsDialog } from './useGardenSettingsDialog'

interface Props {}

export function GardenSettingsDialog({}: Props) {
  const { isMobile, layout, setLayout } = useDesignContext()
  const { isOpen, setIsOpen, layoutItem } = useGardenSettingsDialog()

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
