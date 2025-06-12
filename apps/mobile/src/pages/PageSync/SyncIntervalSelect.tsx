import { useState } from 'react'
import { CardItem } from '@/components/ui/CardItem'
import { Drawer } from '@/components/ui/Drawer'
import { DrawerHeader } from '@/components/ui/DrawerHeader'
import { DrawerTitle } from '@/components/ui/DrawerTitle'
import { Menu } from '@/components/ui/Menu'
import { MenuItem } from '@/components/ui/MenuItem'
import { impact } from '@/lib/impact'
import { Trans } from '@lingui/react/macro'
import { useQuery } from '@tanstack/react-query'
import { get, set } from 'idb-keyval'
import { ChevronRightIcon } from 'lucide-react'

interface Props {}
const key = 'SYNC_INTERVAL'
export const SyncIntervalSelect = ({}: Props) => {
  const [open, setOpen] = useState(false)
  const {
    isLoading,
    data: value,
    refetch,
  } = useQuery({
    queryKey: ['syncInterval'],
    queryFn: async () => {
      const interval = await get(key)
      return (interval as number) || 1000 * 60 * 30
    },
  })

  const options = [
    {
      label: <Trans>5 minutes</Trans>,
      value: 1000 * 60 * 5,
    },
    {
      label: <Trans>10 minutes</Trans>,
      value: 1000 * 60 * 10,
    },
    {
      label: <Trans>30 minutes</Trans>,
      value: 1000 * 60 * 30,
    },
    {
      label: <Trans>1 hour</Trans>,
      value: 1000 * 60 * 60,
    },
    {
      label: <Trans>12 hours</Trans>,
      value: 1000 * 60 * 60 * 12,
    },
    {
      label: <Trans>24 hours</Trans>,
      value: 1000 * 60 * 60 * 24,
    },
  ]

  const item = options.find((o) => o.value === value)
  return (
    <>
      <CardItem
        onClick={() => {
          setOpen(true)
        }}
      >
        <span>
          <Trans>Time interval</Trans>
        </span>
        <div className="flex items-center gap-1">
          <span>{item?.label}</span>
          <ChevronRightIcon className="text-foreground/50 size-5" />
        </div>
      </CardItem>

      {!isLoading && (
        <Drawer open={open} setOpen={setOpen} className="">
          <DrawerHeader>
            <DrawerTitle>
              <Trans>Sync interval</Trans>
            </DrawerTitle>
          </DrawerHeader>
          <Menu>
            {options.map((item) => (
              <MenuItem
                key={item.value}
                // className="flex h-12 items-center justify-between px-3"
                checked={item.value === value}
                onClick={async () => {
                  impact()
                  await set(key, item.value)
                  refetch()
                  setOpen(false)
                }}
              >
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </Drawer>
      )}
    </>
  )
}
