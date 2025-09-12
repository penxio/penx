import { useEffect, useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { useQuery } from '@tanstack/react-query'
import { get, set } from 'idb-keyval'
import { ChevronRightIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@penx/uikit/select'

interface Props {}
const key = 'SYNC_INTERVAL'
export const SyncIntervalSelect = ({}: Props) => {
  const { data, refetch } = useQuery({
    queryKey: ['syncInterval'],
    queryFn: async () => {
      const interval = await get(key)

      return (interval as number) || 1000 * 60 * 30
    },
  })

  const [value, setValue] = useState('')

  useEffect(() => {
    if (!data) return
    setValue(data.toString())
  }, [data])

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

  return (
    <div className="flex items-center justify-between">
      <span>
        <Trans>Time interval</Trans>
      </span>
      <Select
        value={value}
        onValueChange={async (v) => {
          console.log('v========vv:', v)
          setValue(v)
          await set(key, Number(v))
          refetch()
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Interval" />
        </SelectTrigger>
        <SelectContent>
          {options.map((item) => (
            <SelectItem key={item.value} value={item.value.toString()}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
