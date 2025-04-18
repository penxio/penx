import { useMemo } from 'react'
import { trpc } from '@/lib/trpc'

export function useGitHubToken() {
  const { data: github, ...rest } = trpc.github.githubInfo.useQuery()

  const isTokenValid = useMemo(() => {
    if (!github) return false
    return !!github.token
  }, [github])

  return {
    isTokenValid,
    github,
    token: github?.token,
    ...rest,
  }
}
