import { ReactNode, useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { ChevronRightIcon } from 'lucide-react'
import {
  JournalLayout,
  updateJournalLayout,
  useJournalLayout,
} from '@penx/hooks/useJournalLayout'
import { cn } from '@penx/utils'
import { Drawer } from '../Drawer'
import { MenuItem } from './MenuItem'

interface ItemProps {
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}
export function JournalLayoutMenu({ children, className }: ItemProps) {
  const [open, setOpen] = useState(false)
  const { data: layout, isLoading } = useJournalLayout()
  return (
    <div
      className={cn(
        'border-foreground/5 text-foreground flex items-center justify-between border-b py-2',
        className,
      )}
      onClick={() => {
        setOpen(!open)
      }}
    >
      <div className="font-medium">
        <Trans>Journal layout</Trans>
      </div>
      <div>
        <ChevronRightIcon className="text-foreground/50" />
      </div>
      <Drawer
        open={open}
        setOpen={setOpen}
        className="bg-neutral-100 dark:bg-neutral-800"
      >
        <div className="mb-2 text-center font-bold">
          <Trans>Theme</Trans>
        </div>
        <div className="divide-foreground/5 divide-y rounded-xl dark:bg-neutral-700">
          {layout && (
            <div className="divide-foreground/5 divide-y rounded-xl dark:bg-neutral-700">
              <MenuItem
                checked={layout == JournalLayout.BUBBLE}
                onClick={() => {
                  updateJournalLayout(JournalLayout.BUBBLE)
                  setOpen(false)
                }}
              >
                <Trans>Bubble</Trans>
              </MenuItem>
              <MenuItem
                checked={layout == JournalLayout.CARD}
                onClick={() => {
                  updateJournalLayout(JournalLayout.CARD)
                  setOpen(false)
                }}
              >
                <Trans>Card</Trans>
              </MenuItem>
              <MenuItem
                checked={layout == JournalLayout.LIST}
                onClick={() => {
                  updateJournalLayout(JournalLayout.LIST)
                  setOpen(false)
                }}
              >
                <Trans>List</Trans>
              </MenuItem>
            </div>
          )}
        </div>
      </Drawer>
    </div>
  )
}
