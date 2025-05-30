'use client'

import React, { useMemo, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { SocialLogin } from '@capgo/capacitor-social-login'
import { LOG_LEVEL, Purchases } from '@revenuecat/purchases-capacitor'
import { useQuery } from '@tanstack/react-query'
import { set } from 'idb-keyval'
import { appEmitter } from '@penx/emitter'
import { db } from '@penx/pg'
import { queryClient } from '@penx/query-client'
import { useSession } from '@penx/session'
import { MobileGoogleLoginInfo } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { IconGoogle } from '@penx/uikit/IconGoogle'
import { LoadingDots } from '@penx/uikit/loading-dots'

interface Props {}

const platform = Capacitor.getPlatform()

export function PlanList({}: Props) {
  const { isLoading, data } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      try {
        const offerings = await Purchases.getOfferings()

        if (offerings.current !== null) {
          const availablePackages = offerings.current.availablePackages
          return availablePackages
        } else {
          return []
        }
      } catch (error) {
        return []
      }
    },
  })
  if (isLoading) return null
  return (
    <div>
      <div>Hello</div>
      <div>{JSON.stringify(data, null, 2)}</div>
    </div>
  )
}
