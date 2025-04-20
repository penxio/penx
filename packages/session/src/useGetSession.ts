'use client'

import { useMemo } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { BillingCycle, PlanType } from '@prisma/client'
import { queryClient } from '@penx/query-client'
import {
  GoogleLoginData,
  LoginData,
  SessionData,
  UpdateProps,
  UpdateSessionData,
} from '@penx/types'

const sessionApiRoute = '/api/session'
const queryKey = ['session']

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

export function getSession() {
  return queryClient.getQueryData(queryKey) as SessionData
}

export function useGetSession() {
  const { isPending, data: session } = useQuery({
    queryKey,
    queryFn: () => fetchJson<SessionData>(sessionApiRoute),
    staleTime: 5 * 60 * 1000,
  })

  async function login(data: LoginData & { host?: string }) {
    const res = await fetchJson<SessionData>(sessionApiRoute, {
      body: JSON.stringify({
        ...data,
        host: location.host,
      }),
      method: 'POST',
    })

    queryClient.setQueriesData({ queryKey }, res)
    return res
  }

  async function logout() {
    const res = await fetchJson<SessionData>(sessionApiRoute, {
      method: 'DELETE',
    })

    queryClient.setQueriesData({ queryKey }, res)
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
    queryClient.setQueriesData({ queryKey }, res)
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
