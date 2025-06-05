'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { get, set } from 'idb-keyval'
import { ROOT_HOST } from '@penx/constants'
import { queryClient } from '@penx/query-client'
import type { LoginData, SessionData, UpdateSessionData } from '@penx/types'

export const PlanType = {
  FREE: 'FREE',
  BASIC: 'BASIC',
  STANDARD: 'STANDARD',
  PRO: 'PRO',
  TEAM: 'TEAM',
  BELIEVER: 'BELIEVER',
}

export type PlanType = (typeof PlanType)[keyof typeof PlanType]

export const BillingCycle = {
  NONE: 'NONE',
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY',
  BELIEVER: 'BELIEVER',
  COUPON: 'COUPON',
}

const sessionApiRoute = `${ROOT_HOST}/api/session`

const SESSION_KEY = 'SESSION'

async function fetchJson<JSON = unknown>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  return fetch(input, {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    ...init,
  }).then((res) => res.json())
}

export function useSession() {
  const { isPending, data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      // const localSession = await get(SESSION_KEY)
      // if (localSession) return localSession as SessionData
      // console.log('========sessionApiRoute:', sessionApiRoute)

      const session = await fetchJson<SessionData>(sessionApiRoute)
      if (session.isLoggedIn) {
        await set(SESSION_KEY, session)
      }
      return session
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  async function login(data: LoginData & { host?: string }) {
    const res = await fetchJson<SessionData>(sessionApiRoute, {
      body: JSON.stringify({
        ...data,
        host: location.host,
      }),
      method: 'POST',
    })

    queryClient.setQueriesData({ queryKey: ['session'] }, res)

    await set('SESSION', res)
    return res
  }

  async function logout() {
    const res = await fetchJson<SessionData>(sessionApiRoute, {
      method: 'DELETE',
    })

    queryClient.setQueriesData({ queryKey: ['session'] }, res)
  }

  const status = useMemo(() => {
    if (isPending) return 'loading'
    if (!session?.isLoggedIn) return 'unauthenticated'
    if (session?.isLoggedIn) return 'authenticated'
    return 'loading'
  }, [isPending, session]) as 'loading' | 'unauthenticated' | 'authenticated'

  async function update(data: UpdateSessionData) {
    const res = await fetchJson<SessionData>(sessionApiRoute, {
      body: JSON.stringify(data),
      method: 'PATCH',
    })
    await set('SESSION', res)
    queryClient.setQueriesData({ queryKey: ['session'] }, res)
  }

  const formattedSession = useMemo(() => {
    if (!session?.isLoggedIn) return undefined
    let planType = session.planType

    if (
      session.currentPeriodEnd &&
      Date.now() > new Date(session.currentPeriodEnd).getTime()
    ) {
      planType = PlanType.FREE
    }

    const isFree = planType === PlanType.FREE
    const isPro = planType === PlanType.PRO
    const isBasic = planType === PlanType.BASIC

    const isSubscription = [BillingCycle.MONTHLY, BillingCycle.YEARLY].includes(
      session?.billingCycle as any,
    )

    let isBeliever = false

    if (
      session.believerPeriodEnd &&
      new Date(session.believerPeriodEnd).getTime() > Date.now()
    ) {
      isBeliever = true
    }

    return {
      ...session,
      planType,
      isFree,
      isBeliever,
      isSubscription,
      isPro,
      isBasic,
    }
  }, [session])

  return {
    session: formattedSession,
    data: formattedSession,
    logout,
    login,
    status,
    update,
    isLoading: isPending,
    subscriptions: [] as any,
  }
}
