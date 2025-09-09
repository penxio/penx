'use client'

import { useMemo } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
// import { fetch as tauriFetch } from '@tauri-apps/plugin-http'
import { get, set } from 'idb-keyval'
import { api } from '@penx/api'
import {
  isDesktop,
  isExtension,
  isMobileApp,
  isWeb,
  PLATFORM,
  ROOT_HOST,
} from '@penx/constants'
import { appEmitter } from '@penx/emitter'
import { queryClient } from '@penx/query-client'
import {
  BillingCycle,
  GoogleLoginData,
  LoginData,
  PlanType,
  SessionData,
  SubscriptionSource,
  UpdateProps,
  UpdateSessionData,
} from '@penx/types'

// const fetchClient = isDesktop ? tauriFetch : fetch
const fetchClient = fetch

// @ts-ignore
const sessionApiRoute = `${ROOT_HOST}/api/session`

const SESSION = 'SESSION'

const queryKey = [SESSION]

async function fetchJson<JSON = unknown>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  return fetchClient(input, {
    // headers: {
    //   accept: 'application/json',
    //   'content-type': 'application/json',
    // },
    ...init,
  }).then((res) => res.json())
}

export async function getSession() {
  // const session = queryClient.getQueryData(queryKey) as SessionData
  // if (session) return session
  const localSession = await get(SESSION)
  return localSession as SessionData
}

export function useQuerySession() {
  const {
    isPending,
    data: session,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const localSession = await get<SessionData>(SESSION)
      // console.log('======isDesktop:', isDesktop, 'localSession:', localSession)

      if (isDesktop || isExtension || isMobileApp || !navigator.onLine) {
        return localSession || null
      }

      const remoteSession = await fetchJson<SessionData>(sessionApiRoute)

      // console.log('===remoteSession:', remoteSession)

      if (!remoteSession?.isLoggedIn) return null as any as SessionData

      await set(SESSION, remoteSession)

      return remoteSession as SessionData
    },
    // staleTime: 5 * 60 * 1000,
  })

  // watch web login
  window.addEventListener('message', async (event) => {
    if (
      event.data &&
      event.data.type === 'penx-logout' &&
      event.data.source === 'penx-account'
    ) {
      alert('1111111111')
      logout()
    }

    if (
      event.data &&
      event.data.type === 'penx-login' &&
      event.data.source === 'penx-account'
    ) {
      alert('2222222222')
      await set(SESSION, event.data.payload)
      refetch()
    }
  })

  async function login(data: LoginData & { host?: string }) {
    console.log('=========sessionApiRoute:', sessionApiRoute)
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
    if (isMobileApp || isDesktop) {
      queryClient.setQueryData(queryKey, {})
    } else {
      const res = await fetchJson<SessionData>(sessionApiRoute, {
        method: 'DELETE',
      })

      queryClient.setQueryData(queryKey, res)
    }
    await set(SESSION, undefined)
  }

  const status = useMemo(() => {
    if (isPending) return 'loading'
    if (!session?.isLoggedIn) return 'unauthenticated'
    if (session?.isLoggedIn) return 'authenticated'
    return 'loading'
  }, [isPending, session]) as 'loading' | 'unauthenticated' | 'authenticated'

  async function update(data: UpdateSessionData) {
    if (isDesktop) return
    const res = await fetchJson<SessionData>(sessionApiRoute, {
      body: JSON.stringify(data),
      method: 'PATCH',
    })
    queryClient.setQueryData(queryKey, res)
  }

  const formattedSession = useMemo(() => {
    if (!session?.isLoggedIn) return undefined
    let planType = session.planType
    const isApple = session.subscriptionSource === SubscriptionSource.APPLE

    if (
      !isApple &&
      ![BillingCycle.COUPON, BillingCycle.BELIEVER].includes(
        session.billingCycle as any,
      ) &&
      session.currentPeriodEnd &&
      Date.now() > new Date(session.currentPeriodEnd).getTime()
    ) {
      planType = PlanType.FREE
    }

    if (isApple && session.subscriptionStatus !== 'active') {
      planType = PlanType.FREE
    }

    const isFree = planType === PlanType.FREE
    const isPro = planType === PlanType.PRO
    const isStandard = planType === PlanType.STANDARD

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
      isStandard,
    }
  }, [session])

  return {
    session: formattedSession as SessionData,
    data: formattedSession as SessionData,
    logout,
    login,
    status,
    update,
    refetch,
    isLoading: isPending,
    subscriptions: [] as any,
  }
}

export async function updateSession(data: Partial<SessionData>) {
  if (isWeb || isExtension) {
    const res = await fetchJson<SessionData>(sessionApiRoute, {
      body: JSON.stringify({
        type: 'update-props',
        ...data,
      }),
      method: 'PATCH',
    })
  }

  const session = queryClient.getQueryData(queryKey) || (await getSession())
  const newSession = { ...session, ...data }
  console.log('=======newSession:', newSession)
  queryClient.setQueryData(queryKey, newSession)
  await set(SESSION, newSession)
}

export async function refreshSession() {
  // const localSession = await getSession()
  // if (!localSession) return
  const newSession = await api.getSession(true)
  queryClient.setQueryData(queryKey, newSession)
  await set(SESSION, newSession)
}
