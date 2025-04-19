import { DomainResponse, DomainVerificationStatusProps } from '@/lib/types'
import { fetcher } from '@penx/utils'
import useSWR from 'swr'

export function useDomainStatus({
  domain,
  refreshInterval,
}: {
  domain: string
  refreshInterval?: number
}) {
  const { data, isValidating } = useSWR<{
    status: DomainVerificationStatusProps
    domainJson: DomainResponse & { error: { code: string; message: string } }
  }>(`/api/domain/${domain}/verify`, fetcher, {
    revalidateOnMount: true,
    refreshInterval: refreshInterval ?? 5000,
    keepPreviousData: true,
  })

  return {
    status: data?.status,
    domainJson: data?.domainJson,
    loading: isValidating,
  }
}
