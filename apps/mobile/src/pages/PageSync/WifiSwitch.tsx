import { ToggleSwitch } from '@/components/MobilePropList/ToggleSwitch'
import { CardItem } from '@/components/ui/CardItem'
import { Trans } from '@lingui/react/macro'
import { useQuery } from '@tanstack/react-query'
import { get, set } from 'idb-keyval'
import { queryClient } from '@penx/query-client'

interface Props {}
const key = 'SYNC_OVER_WIFI'

export const WifiSwitch = ({}: Props) => {
  const { data: value } = useQuery({
    queryKey: [key],
    queryFn: async () => {
      const value = await get(key)
      return value ?? false
    },
  })

  return (
    <CardItem>
      <span>
        <Trans>Sync only over Wi-Fi</Trans>
      </span>
      <ToggleSwitch
        isOn={value!}
        onChange={(v) => {
          queryClient.setQueryData([key], v)
          set(key, v)
        }}
      />
    </CardItem>
  )
}
