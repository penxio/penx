'use client'

import { useState } from 'react'
import { impact } from '@/lib/impact'
import { Trans } from '@lingui/react/macro'
import { ChevronsUpDown, PlusIcon, Settings2Icon } from 'lucide-react'
import { motion } from 'motion/react'
import { useArea } from '@penx/hooks/useArea'
import { useAreas } from '@penx/hooks/useAreas'
import { useMobileMenu } from '@penx/hooks/useMobileMenu'
import { widgetAtom } from '@penx/hooks/useWidget'
import { store } from '@penx/store'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import { Button } from '@penx/uikit/ui/button'
import { Separator } from '@penx/uikit/ui/separator'
import { cn, getUrl } from '@penx/utils'
import { generateGradient } from '@penx/utils/generateGradient'
import { AnimateChangeInHeight } from '../AnimateChangeInHeight'
import { DrawerClose } from '../ui/DrawerClose'
import { Menu } from '../ui/Menu'
import { MenuItem } from '../ui/MenuItem'
import { AreasDrawer } from './AreasDrawer'
import { CreateArea } from './CreateArea'

interface Props {
  className?: string
}

export const AreasMenu = ({ className = '' }: Props) => {
  const { areas = [] } = useAreas()
  const [open, setOpen] = useState(false) // for select
  const { area } = useArea()
  const { close } = useMobileMenu()
  if (!area) return null

  return (
    <>
      <div
        className="flex h-10 flex-1 cursor-pointer items-center gap-1"
        onClick={() => {
          impact()
          setOpen(true)
          close()
        }}
      >
        <div className="flex items-center gap-1">
          <Avatar className="size-6 rounded-md">
            <AvatarImage src={area.logo} alt="" />
            <AvatarFallback
              className={cn(
                'rounded-md text-xs text-white',
                generateGradient(area.name),
              )}
            >
              {area.name.slice(0, 1)}
            </AvatarFallback>
          </Avatar>

          <div className="grid flex-1 text-left text-lg">
            <span className="truncate font-semibold">{area?.name}</span>
          </div>
        </div>
        <ChevronsUpDown className="size-3" />
      </div>

      <AreasDrawer open={open} setOpen={setOpen} className="">
        <AnimateChangeInHeight>
          <div>
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold">
                <Trans>Areas</Trans>
              </div>
              <DrawerClose></DrawerClose>
            </div>
            <Separator className="my-2 h-[0.5px]" />
            <div className="">
              {areas.map((item) => (
                <MenuItem
                  key={item.id}
                  className={cn(
                    '-mx-3 flex cursor-pointer items-center gap-2 rounded-lg',
                    item.id === area.id && 'bg-foreground/8',
                  )}
                  onClick={async () => {
                    store.area.set(item.raw)
                    store.set(widgetAtom, item.raw.props.widgets[0])
                    store.creations.refetchCreations(item.id)
                    store.structs.refetchStructs(item.id)
                    store.visit.setAndSave({ activeAreaId: item.id })
                    store.panels.resetPanels()
                    setOpen(false)
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="size-7 rounded-md">
                      <AvatarImage src={getUrl(item.logo!)} alt="" />
                      <AvatarFallback
                        className={cn(
                          'rounded-md text-white',
                          generateGradient(item.name),
                        )}
                      >
                        {item.name.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-lg">{item.name}</div>
                  </div>
                  {/* <Button variant="ghost" size="icon" className="ml-auto">
                  <Settings2Icon size={20} />
                </Button> */}
                </MenuItem>
              ))}
              <CreateArea onClick={() => setOpen(false)} />
            </div>
          </div>
        </AnimateChangeInHeight>
      </AreasDrawer>
    </>
  )
}
