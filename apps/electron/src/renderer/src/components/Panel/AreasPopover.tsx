'use client'

import { Trans } from '@lingui/react/macro'
import { ChevronsUpDown, PlusIcon } from 'lucide-react'
import { useArea } from '@penx/hooks/useArea'
import { useAreas } from '@penx/hooks/useAreas'
import { useMobileMenu } from '@penx/hooks/useMobileMenu'
import { store } from '@penx/store'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { cn, getUrl } from '@penx/utils'
import { generateGradient } from '@penx/utils/generateGradient'

interface Props {
  className?: string
}

export const AreasPopover = ({ className = '' }: Props) => {
  const { areas = [] } = useAreas()
  const { close } = useMobileMenu()
  const { area } = useArea()

  if (!area) return null

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="hover:bg-foreground/8 group/area no-drag flex h-8 w-full cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors">
          <div className="flex flex-1 cursor-pointer items-center gap-1">
            <div className="flex items-center gap-1">
              <Avatar className="size-5 rounded-md">
                <AvatarImage src={area.logo} alt="" />
                <AvatarFallback
                  className={cn('rounded-md text-xs text-white', generateGradient(area.name))}
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
      </PopoverTrigger>
      <PopoverContent className="z-[1000000] w-56 p-1 dark:bg-neutral-800" align="start">
        {areas.map((item) => (
          <div
            key={item.id}
            className="flex cursor-pointer items-center gap-2 py-2"
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
              <AvatarFallback className={cn('rounded-md text-white', generateGradient(item.name))}>
                {item.name.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div>{item.name}</div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  )
}
