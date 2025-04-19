'use client'

import * as React from 'react'
import { NavUser } from '@/app/[lang]/~/(dashboard)/Sidebar/nav-user'
import { AddCreationButton } from '@/components/AddCreationButton'
import { ModeToggle } from '@/components/ModeToggle'
import { useSession } from '@/components/session'
import { Button } from '@penx/ui/components/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@penx/ui/components/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@penx/ui/components/tooltip'
import { useRouter } from '@/lib/i18n'
import { Trans } from '@lingui/react/macro'
import { PaletteIcon, TagsIcon } from 'lucide-react'
import { AreaWidgets } from './area-widgets'
import { FieldsPopover } from './AreasPopover/AreasPopover'
import { ImportPostEntry } from './ImportPostEntry'
import { QuickSearchTrigger } from './QuickSearchTrigger'
import { VisitSiteButton } from './VisitSiteButton'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { push } = useRouter()
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="m-0 p-0">
        <SidebarMenu className="">
          <SidebarMenuItem className="">
            <FieldsPopover />
          </SidebarMenuItem>
        </SidebarMenu>
        {/* <QuickSearchTrigger /> */}
      </SidebarHeader>
      <SidebarContent className="-mx-2">
        <AreaWidgets />
        {/* <ImportPostEntry /> */}
      </SidebarContent>
      <SidebarFooter className="py-0">
        <div className="flex items-center justify-between">
          <div>
            <VisitSiteButton />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-foreground/8 size-8"
                    onClick={() => {
                      push('/~/design')
                    }}
                  >
                    <PaletteIcon size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <Trans>Design my site</Trans>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-foreground/8 size-8"
                    onClick={() => {
                      push('/~/settings/tags')
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
            <ModeToggle className="hover:bg-foreground/8" />
          </div>
          <NavUser />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
