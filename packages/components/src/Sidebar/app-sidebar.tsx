'use client'

import * as React from 'react'
import { Trans } from '@lingui/react'
import {
  DatabaseBackupIcon,
  GlobeIcon,
  PaletteIcon,
  TagsIcon,
} from 'lucide-react'
import { ModeToggle } from '@penx/components/ModeToggle'
import { isDesktop, isMobileApp, isWeb, ROOT_HOST } from '@penx/constants'
import { appEmitter } from '@penx/emitter'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import { PanelType } from '@penx/types'
import { Button } from '@penx/uikit/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@penx/uikit/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@penx/uikit/tooltip'
import { useLoginDialog } from '@penx/widgets/LoginDialog/useLoginDialog'
import { AddCreationButton } from '../AddCreationButton'
import { AreaWidgets } from '../area-widgets'
import { AreasPopover } from '../AreasPopover/AreasPopover'
import { ProfileButton } from '../ProfileButton'
import { ImportPostEntry } from './ImportPostEntry'
import { QuickSearchTrigger } from './QuickSearchTrigger'
import { VisitSiteButton } from './VisitSiteButton'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="m-0 p-0 pb-1">
        <SidebarMenu className="">
          <SidebarMenuItem className="">
            <AreasPopover />
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="mb-1 flex items-center justify-between gap-1">
          <QuickSearchTrigger />
          {!isMobileApp && <AddCreationButton></AddCreationButton>}
        </div>
      </SidebarHeader>
      <SidebarContent className="-mx-2 space-y-2">
        <AreaWidgets />
      </SidebarContent>
      <SidebarFooter className="py-0">
        <div className="flex items-center justify-between">
          <div>
            {/* {session && <VisitSiteButton />} */}

            {/* <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-foreground/8 size-8"
                    onClick={() => {
                      if (!session) return setIsOpen(true)
                      // console.log('======isWeb:', isWeb)
                      if (isWeb) {
                        appEmitter.emit('ROUTE_TO_DESIGN')
                      } else {
                        window.open(`${ROOT_HOST}/~/design`)
                      }
                    }}
                  >
                    <PaletteIcon size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <Trans id="Design my site"></Trans>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider> */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-foreground/8 size-8"
                    onClick={() => {
                      store.panels.addPanel({
                        type: PanelType.MANAGE_TAGS,
                      })
                    }}
                  >
                    <TagsIcon size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <Trans id="Manage tags"></Trans>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* {isDesktop && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-foreground/8 size-8"
                      onClick={() => {
                        store.panels.addPanel({
                          type: PanelType.LOCAL_BACKUP,
                        })
                      }}
                    >
                      <DatabaseBackupIcon size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <Trans id="Local backup"></Trans>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )} */}
            <ModeToggle className="hover:bg-foreground/8" />
          </div>
          <ProfileButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
