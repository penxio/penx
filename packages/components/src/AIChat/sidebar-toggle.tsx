import type { ComponentProps } from 'react';

import { type SidebarTrigger, useSidebar } from '@penx/uikit/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@penx/uikit/tooltip';

import { SidebarLeftIcon } from './icons';
import { Button } from '@penx/uikit/button';

export function SidebarToggle({
  className,
}: ComponentProps<typeof SidebarTrigger>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          data-testid="sidebar-toggle-button"
          onClick={toggleSidebar}
          variant="outline"
          className="md:px-2 md:h-fit"
        >
          <SidebarLeftIcon size={16} />
        </Button>
      </TooltipTrigger>
      <TooltipContent align="start">Toggle Sidebar</TooltipContent>
    </Tooltip>
  );
}
