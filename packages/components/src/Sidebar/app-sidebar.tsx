'use client'

import * as React from 'react'
import { useCompletion } from '@ai-sdk/react'
import { Trans } from '@lingui/react/macro'
import { usePollinationsText } from '@pollinations/react'
import {
  DatabaseBackupIcon,
  GlobeIcon,
  PaletteIcon,
  RefreshCcwIcon,
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
  SidebarTrigger,
} from '@penx/uikit/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@penx/uikit/tooltip'
import { uniqueId } from '@penx/unique-id'
import { cn } from '@penx/utils'
import { useLoginDialog } from '@penx/widgets/LoginDialog/useLoginDialog'
import { AddCreationButton } from '../AddCreationButton'
import { AreaWidgets } from '../area-widgets'
import { AreaMenu } from '../AreasPopover/AreaMenu'
import { AreasPopover } from '../AreasPopover/AreasPopover'
import { LangSwitcher } from '../LangSwitcher'
import { ProfileButton } from '../ProfileButton'
import { ImportPostEntry } from './ImportPostEntry'
import { QuickSearchTrigger } from './QuickSearchTrigger'
import { SyncButton } from './SyncButton'
import { VisitSiteButton } from './VisitSiteButton'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props} className="">
      <SidebarHeader className="m-0 p-0 pb-1">
        {isDesktop && (
          <div className="drag -mx-2 -mt-2 ml-[70px] flex h-8 items-center">
            {/* <SidebarTrigger className="text-foreground/60 size-4" /> */}
          </div>
        )}
        {/* <SidebarMenu className="">
          <SidebarMenuItem className="">
            <AreasPopover />
          </SidebarMenuItem>
        </SidebarMenu> */}
        <div className="mb-1 flex items-center justify-between gap-1">
          <QuickSearchTrigger />
          {!isMobileApp && <AddCreationButton></AddCreationButton>}
        </div>
      </SidebarHeader>
      <SidebarContent className="-mx-2 space-y-2">
        <AreaWidgets />
      </SidebarContent>
      <SidebarFooter className="p0-1 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
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
                  <Trans>Design my site</Trans>
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
                  <Trans>Manage tags</Trans>
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
                    <Trans>Local backup</Trans>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )} */}
            <ModeToggle className="hover:bg-foreground/8" />

            <SyncButton />
            {/* <AreaMenu /> */}
            {/* <LangSwitcher /> */}
          </div>
          <ProfileButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
