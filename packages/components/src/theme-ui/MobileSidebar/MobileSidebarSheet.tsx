'use client'

import { PropsWithChildren, ReactNode } from 'react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@penx/uikit/ui/sheet'
import { Site } from '@penx/types'
import { Menu } from 'lucide-react'
import { Navigation } from '../Navigation'
import { useMobileSidebarSheet } from './useMobileSidebarSheet'

interface Props {
  site: Site
  logo?: ReactNode
}

export function MobileSidebarSheet({
  site,
  logo,
  children,
}: PropsWithChildren<Props>) {
  const { isOpen, setIsOpen } = useMobileSidebarSheet()
  return (
    <div className="flex items-center gap-1 md:hidden">
      <Sheet open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
        <SheetTrigger className="block md:hidden">
          <Menu />
        </SheetTrigger>
        <SheetDescription className="hidden"></SheetDescription>
        <SheetContent
          side="left"
          className="flex flex-col gap-6 overflow-y-auto"
        >
          <SheetHeader className="text-left">
            <SheetTitle>{site.name}</SheetTitle>
          </SheetHeader>

          {!!children ? (
            <>{children}</>
          ) : (
            <div
              className="px-4"
              onClick={(e) => {
                setIsOpen(false)
              }}
            >
              <Navigation
                site={site}
                className="flex items-start md:hidden md:items-center"
              />
            </div>
          )}
        </SheetContent>
      </Sheet>
      {!!logo && logo}
    </div>
  )
}
