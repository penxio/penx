'use client'

import { useState } from 'react'
import { impact } from '@/lib/impact'
import { Trans } from '@lingui/react/macro'
import { ChevronsUpDown } from 'lucide-react'
import { useArea } from '@penx/hooks/useArea'
import { useAreas } from '@penx/hooks/useAreas'
import { store } from '@penx/store'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import { cn, getUrl } from '@penx/utils'
import { generateGradient } from '@penx/utils/generateGradient'
import { Drawer } from './ui/Drawer'
import { DrawerHeader } from './ui/DrawerHeader'
import { DrawerTitle } from './ui/DrawerTitle'
import { Menu } from './ui/Menu'
import { MenuItem } from './ui/MenuItem'

interface Props {
  className?: string
}

export const AreasMenu = ({ className = '' }: Props) => {
  const { areas = [] } = useAreas()
  const [open, setOpen] = useState(false) // for select
  const [visible, setVisible] = useState(false) // for create
  const { area } = useArea()

  console.log('======areas:', areas)

  if (!area) return null

  return (
    <>
      <div
        className="flex h-10 flex-1 cursor-pointer items-center gap-1"
        onClick={() => {
          impact()
          setOpen(true)
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

      <Drawer open={open} setOpen={setOpen} isFullHeight>
        <DrawerHeader>
          <DrawerTitle>
            <Trans>Areas</Trans>
          </DrawerTitle>
        </DrawerHeader>
        <Menu>
          {areas.map((item) => (
            <MenuItem
              key={item.id}
              className="flex cursor-pointer items-center gap-2"
              onClick={async () => {
                store.area.set(item.raw)
                store.creations.refetchCreations(item.id)
                store.structs.refetchStructs(item.id)
                store.visit.setAndSave({ activeAreaId: item.id })
                store.panels.resetPanels()
              }}
            >
              <div className="flex items-center gap-2">
                <Avatar className="size-6 rounded-md">
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
                <div>{item.name}</div>
              </div>
            </MenuItem>
          ))}
        </Menu>
      </Drawer>
      <Drawer open={visible} setOpen={setVisible} isFullHeight>
        <DrawerHeader>
          <DrawerTitle>
            <Trans>Areas</Trans>
          </DrawerTitle>
        </DrawerHeader>
      </Drawer>
    </>
  )
}
