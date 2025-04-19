'use client'

import { memo, useCallback, useEffect } from 'react'
import { useAreaDialog } from '@/components/AreaDialog/useAreaDialog'
import { ProfileAvatar } from '@/components/Profile/ProfileAvatar'
import { useSession } from '@/components/session'
import { useSiteContext } from '@/components/SiteContext'
import { resetPanels } from '@/hooks/usePanels'
import { useRouter } from '@/lib/i18n'
import { cn, getUrl } from '@penx/utils'
import { Trans } from '@lingui/react/macro'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/ui/avatar'
import { Button } from '@penx/uikit/ui/button'
import { MenuItem } from '@penx/uikit/ui/menu/MenuItem'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/ui/popover'
import { PopoverClose } from '@radix-ui/react-popover'
import { ChevronDown, ChevronsUpDown, HomeIcon, PlusIcon } from 'lucide-react'
import { useParams } from 'next/navigation'

interface Props {
  className?: string
}

export const FieldsPopover = ({ className = '' }: Props) => {
  const { data, logout, update } = useSession()
  const { setIsOpen } = useAreaDialog()
  const { push } = useRouter()
  const site = useSiteContext()
  const params = useParams() as Record<string, string>

  if (!data) return <div></div>

  const area = site.areas.find((item) => item.id === params.id)!

  if (!area) return null

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="hover:bg-foreground/5 group/area flex h-10 w-full cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors">
          <div className="flex flex-1 cursor-pointer items-center gap-1">
            <div className="flex items-center gap-1">
              <Avatar className="h-6 w-6">
                <AvatarImage src={getUrl(area?.logo || '')} alt="" />
                <AvatarFallback>{area?.name.slice(0, 1)}</AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{area?.name}</span>
              </div>
            </div>
            <ChevronsUpDown className="size-3" />
          </div>
          <Button
            variant="ghost"
            className="hover:bg-foreground/7 text-foreground/80 hidden size-7 rounded-md group-hover/area:flex"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              resetPanels()
            }}
          >
            <HomeIcon size={18} className="text-foreground/60" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-1">
        {site.areas.map((item) => (
          <PopoverClose key={item.id} asChild>
            <MenuItem
              className="flex cursor-pointer items-center gap-2"
              onClick={async () => {
                update({
                  type: 'update-props',
                  activeAreaId: item.id,
                })
                resetPanels()
                push(`/~/areas/${item.id}`)
              }}
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={getUrl(item.logo!)} alt="" />
                <AvatarFallback>{item.name.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <div>{item.name}</div>
            </MenuItem>
          </PopoverClose>
        ))}

        <PopoverClose asChild>
          <MenuItem
            className="flex cursor-pointer items-center gap-2"
            onClick={async () => {
              setIsOpen(true)
            }}
          >
            <PlusIcon size={16} />
            <div>
              <Trans>Create area</Trans>
            </div>
          </MenuItem>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  )
}
