'use client'

import { useState } from 'react'
import { Trans } from '@lingui/react'
import { DialogTitle } from '@radix-ui/react-dialog'
import { ChevronDown, ChevronsUpDown, HomeIcon, PlusIcon } from 'lucide-react'
import { Drawer } from 'vaul'
import { useAreaDialog } from '@penx/components/useAreaDialog'
import { useArea } from '@penx/hooks/useArea'
import { useAreas } from '@penx/hooks/useAreas'
import { updateSession, useSession } from '@penx/session'
import { store } from '@penx/store'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import { Button } from '@penx/uikit/button'
import { MenuItem } from '@penx/uikit/menu'
import { cn, getUrl } from '@penx/utils'
import { generateGradient } from '@penx/utils/generateGradient'

interface Props {
  className?: string
  oncClick: () => void
}

export const AreasPopover = ({ className = '', oncClick }: Props) => {
  const { areas = [] } = useAreas()
  const { area } = useArea()
  const [visible, setVisible] = useState(false)
  const { setIsOpen } = useAreaDialog()

  if (!area) return null
  return (
    <div className="flex justify-center">
      <div
        className="inline-flex cursor-pointer items-center gap-1"
        onClick={() => {
          setVisible(true)
        }}
      >
        <div className="flex items-center gap-1">
          {/* <Avatar className="h-5 w-5 rounded-md">
            <AvatarImage
              className="rounded-md"
              src={getUrl(area?.logo || '')}
              alt=""
            />
            <AvatarFallback
              className={cn('rounded-md', generateGradient(area.name))}
            ></AvatarFallback>
          </Avatar> */}

          <div className="grid flex-1 text-left text-base leading-tight">
            <span className="truncate text-lg font-bold">{area?.name}</span>
          </div>
        </div>
        {/* <ChevronsUpDown className="size-3" /> */}
      </div>

      <Drawer.Root open={visible} onOpenChange={setVisible}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="bg-background fixed bottom-0 left-0 right-0 mt-24 flex h-fit min-h-[50vh] flex-col rounded-t-[10px] px-4 pb-6 outline-none">
            <div
              aria-hidden
              className="mx-auto mb-4 mt-2 h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300"
            />

            <DialogTitle className="hidden"></DialogTitle>

            <div className="flex flex-col gap-1">
              {areas.map((item) => (
                <MenuItem
                  key={item.id}
                  className="flex cursor-pointer items-center gap-2 py-3"
                  onClick={async () => {
                    store.area.set(item)
                    store.creations.refetchCreations(item.id)
                    store.visit.setAndSave({ activeAreaId: item.id })
                    // store.panels.resetPanels()
                    setVisible(false)
                  }}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={getUrl(item.logo!)} alt="" />
                    <AvatarFallback
                      className={cn(generateGradient(item.name))}
                    ></AvatarFallback>
                  </Avatar>
                  <div>{item.name}</div>
                </MenuItem>
              ))}

              <MenuItem
                className="flex cursor-pointer items-center gap-2"
                onClick={async () => {
                  setIsOpen(true)
                }}
              >
                <PlusIcon size={16} />
                <div>
                  <Trans id="Create area"></Trans>
                </div>
              </MenuItem>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  )
}
