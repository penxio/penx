import type { ComponentProps } from 'react'
import { Button } from '@penx/uikit/button'
import { useSidebar, type SidebarTrigger } from '@penx/uikit/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@penx/uikit/tooltip'
import { SidebarLeftIcon } from './icons'

export function SidebarToggle({
  className,
}: ComponentProps<typeof SidebarTrigger>) {
  const { toggleSidebar } = useSidebar()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          data-testid="sidebar-toggle-button"
          onClick={toggleSidebar}
          variant="outline"
          className="md:h-fit md:px-2"
        >
          <SidebarLeftIcon size={16} />
        </Button>
      </TooltipTrigger>
      <TooltipContent align="start">Toggle Sidebar</TooltipContent>
    </Tooltip>
  )
}
