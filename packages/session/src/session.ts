'use client'

import { useMemo } from 'react'
import { BillingCycle, PlanType } from '@prisma/client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { get, set } from 'idb-keyval'
import { localDB } from '@penx/local-db'
import { queryClient } from '@penx/query-client'
import {
  GoogleLoginData,
  LoginData,
  SessionData,
  UpdateProps,
  UpdateSessionData,
} from '@penx/types'

// @ts-ignore
const HOST = import.meta.env?.WXT_BASE_URL ?? ''
const sessionApiRoute = `${HOST}/api/session`

const SESSION = 'SESSION'

const queryKey = [SESSION]

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

export async function getSession() {
  const session = queryClient.getQueryData(queryKey) as SessionData
  if (session) return session
  const localSession = await get(SESSION)
  return localSession as SessionData
}

export function useGetSession() {
  const { isPending, data: session } = useQuery({
    queryKey,
    queryFn: async () => {
      const remoteSession = await fetchJson<SessionData>(sessionApiRoute)

      const localSession = await get<SessionData>(SESSION)

      if (!remoteSession?.isLoggedIn) return null as SessionData
      const areas = await localDB.area
        .where({ siteId: remoteSession.siteId })
        .toArray()

      const area =
        areas.find((a) => a.id === localSession?.activeAreaId) || areas?.[0]

      const newSession = {
        ...localSession,
        ...remoteSession,
        activeAreaId: area?.id,
      } as SessionData

      await set(SESSION, newSession)

      return newSession as SessionData
    },
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

    queryClient.setQueryData(queryKey, res)
    return res
  }

  async function logout() {
    const res = await fetchJson<SessionData>(sessionApiRoute, {
      method: 'DELETE',
    })

    queryClient.setQueryData(queryKey, res)
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
    queryClient.setQueryData(queryKey, res)
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
    session: formattedSession as SessionData,
    data: formattedSession as SessionData,
    logout,
    login,
    status,
    update,
    isLoading: isPending,
    subscriptions: [] as any,
  }
}

export async function updateSession(data: Partial<SessionData>) {
  const session = await getSession()
  const newSession = { ...session, ...data }
  queryClient.setQueryData(queryKey, newSession)
  await set(SESSION, newSession)
}
