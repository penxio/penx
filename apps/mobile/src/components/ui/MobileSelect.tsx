import { ReactNode, useState } from 'react'
import { impact } from '@/lib/impact'
import { Trans } from '@lingui/react/macro'
import { ChevronRightIcon } from 'lucide-react'
import { Drawer } from '../ui/Drawer'
import { DrawerHeader } from '../ui/DrawerHeader'
import { DrawerTitle } from '../ui/DrawerTitle'
import { Menu } from '../ui/Menu'
import { MenuItem } from '../ui/MenuItem'

interface Option {
  label: ReactNode
  value: any
}

interface Props {
  isRequired?: boolean
  label: ReactNode
  readOnly?: boolean
  options: Option[]
  value: any
  onChange: (value: any) => void
}

export function MobileSelect({
  label,
  isRequired,
  value = 0,
  onChange,
  options,
}: Props) {
  const [open, setOpen] = useState(false)
  const activeItem = options.find((i) => i.value === value)

  return (
    <>
      <div
        className="text-foreground flex h-12 items-center justify-between gap-3 pl-3 pr-2"
        onClick={async () => {
          impact()
          setOpen(true)
        }}
      >
        <div className="flex shrink-0 items-center gap-0.5">{label}</div>

        <div className="flex items-center">
          <div className="text-foreground/60">{activeItem?.label}</div>
          <ChevronRightIcon className="text-foreground/50 size-5" />
        </div>
      </div>

      <Drawer open={open} setOpen={setOpen} className="">
        <DrawerHeader className="">
          <DrawerTitle>{label}</DrawerTitle>
        </DrawerHeader>
        <div className="-mx-4 -mb-10 min-h-[50vh] flex-1 overflow-y-auto px-4 pb-6">
          <Menu>
            {options.map(({ label, value }, index) => (
              <MenuItem
                key={index}
                checked={activeItem?.value === value}
                onClick={async () => {
                  setOpen(false)
                  impact()
                  onChange(value)
                }}
              >
                <div className="flex items-center gap-2">
                  <span>{label}</span>
                </div>
              </MenuItem>
            ))}
          </Menu>
        </div>
      </Drawer>
    </>
  )
}
