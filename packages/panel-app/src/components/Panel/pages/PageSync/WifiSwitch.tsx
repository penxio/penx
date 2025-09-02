import { Trans } from '@lingui/react/macro'
import { useQuery } from '@tanstack/react-query'
import { get, set } from 'idb-keyval'
import { queryClient } from '@penx/query-client'
import { AnimatedSwitch } from '@penx/uikit/components/AnimatedSwitch'

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
    <div className="flex items-center justify-between">
      <span>
        <Trans>Sync only over Wi-Fi</Trans>
      </span>
      <AnimatedSwitch
        checked={value!}
        onChange={(v) => {
          queryClient.setQueryData([key], v)
          set(key, v)
        }}
      />
    </div>
  )
}
