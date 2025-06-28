import { ReactNode, useState } from 'react'
import { Trans, useLingui } from '@lingui/react/macro'
import { ChevronRightIcon } from 'lucide-react'
import { useTags } from '@penx/hooks/useTags'
import { getTextColorByName } from '@penx/libs/color-helper'
import { cn } from '@penx/utils'
import { AddTagDrawer } from '../MobileTags/AddTagDrawer'
import { Drawer } from '../ui/Drawer'
import { DrawerHeader } from '../ui/DrawerHeader'
import { DrawerTitle } from '../ui/DrawerTitle'
import { EditTagDrawer } from './EditTagDrawer'

interface ItemProps {
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}
export function TagsMenu({ children, className }: ItemProps) {
  const [open, setOpen] = useState(false)
  const { i18n } = useLingui()
  const { tags } = useTags()
  return (
    <>
      <div
        className={cn(
          'flex h-full w-full items-center justify-between',
          className,
        )}
        onClick={() => {
          setOpen(!open)
        }}
      >
        <div className="font-medium">
          <Trans>Tags</Trans>
        </div>
        <div>
          <ChevronRightIcon className="text-foreground/50" />
        </div>
      </div>

      <Drawer open={open} setOpen={setOpen} isFullHeight>
        <DrawerHeader confirmButton={<AddTagDrawer />}>
          <DrawerTitle>
            <Trans>Tags</Trans>
          </DrawerTitle>
        </DrawerHeader>

        <div className={cn('flex flex-col gap-0.5 pb-2')}>
          {tags.map((tag) => (
            <div
              key={tag.id}
              className={cn(
                'text-foreground hover:bg-foreground/5 bg-amber-200-10 flex  h-10 cursor-pointer items-center gap-1 rounded-md text-lg',
                getTextColorByName(tag.color),
              )}
            >
              <div>#</div>
              <div>{tag.name}</div>
              <div className="text-foreground/50 border-0.5 border-foreground/10 ml-1 rounded-full px-2 text-xs">
                {tag.creationCount}
              </div>
              <div className="ml-auto flex items-center">
                <EditTagDrawer tag={tag} />
              </div>
            </div>
          ))}
        </div>
      </Drawer>
    </>
  )
}
