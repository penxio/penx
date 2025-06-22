'use client'

import { useState } from 'react'
import { impact } from '@/lib/impact'
import { Trans } from '@lingui/react/macro'
import { ChevronsUpDown, PlusIcon, Settings2Icon } from 'lucide-react'
import { motion } from 'motion/react'
import { useArea } from '@penx/hooks/useArea'
import { useAreas } from '@penx/hooks/useAreas'
import { useMobileMenu } from '@penx/hooks/useMobileMenu'
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
    <Menu title="My areas">
      {areas.map((item) => (
        <MenuItem
          key={item.id}
          className={cn('flex cursor-pointer items-center gap-2')}
          checked={item.id === area.id}
          onClick={async () => {
            store.area.set(item.raw)
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
    </Menu>
  )
}
