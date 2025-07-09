'use client'

import { Trans } from '@lingui/react/macro'
import { ChevronsUpDown, PlusIcon } from 'lucide-react'
import { isMobileApp } from '@penx/constants'
import { useArea } from '@penx/hooks/useArea'
import { useAreas } from '@penx/hooks/useAreas'
import { useMobileMenu } from '@penx/hooks/useMobileMenu'
import { store } from '@penx/store'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@penx/uikit/dropdown-menu'
import { MenuItem } from '@penx/uikit/menu'
import { cn, getUrl } from '@penx/utils'
import { generateGradient } from '@penx/utils/generateGradient'
import { useAreaDialog } from '../AreaDialog/useAreaDialog'
import { AreaMenu } from './AreaMenu'

interface Props {
  className?: string
}

export const AreasPopover = ({ className = '' }: Props) => {
  const { setIsOpen } = useAreaDialog()
  const { areas = [] } = useAreas()
  const { close } = useMobileMenu()
  const { area } = useArea()

  if (!area) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="hover:bg-foreground/8 bg-foreground/5 group/area no-drag flex h-10 w-full cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors">
          <div className="flex flex-1 cursor-pointer items-center gap-1">
            <div className="flex items-center gap-1">
              <Avatar className="size-5 rounded-md">
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

              <div className="grid flex-1 text-left text-base leading-tight">
                <span className="truncate font-semibold">{area?.name}</span>
              </div>
            </div>
            <ChevronsUpDown className="size-3" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="z-[1000000] w-56 p-1">
        {areas.map((item) => (
          <DropdownMenuItem
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
          </DropdownMenuItem>
        ))}

        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2"
          onClick={async () => {
            setIsOpen(true)
            if (isMobileApp) close()
          }}
        >
          <PlusIcon size={16} />
          <div>
            <Trans>Create area</Trans>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
