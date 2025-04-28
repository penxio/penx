'use client'

import React, { useCallback, useEffect, useRef } from 'react'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/button'
import { trpc } from '@penx/trpc-client'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

export function ValidateEmail() {
  const searchParams = useSearchParams()
  const { data, login } = useSession()
  const inited = useRef(false)

  const loginWithEmail = useCallback(
    async function () {
      const token = searchParams?.get('token') as string
      try {
        const result = await login({
          type: 'register-by-email',
          validateToken: token,
        })

        console.log('=====result:', result)
      } catch (error) {
        console.log('>>>>>>>>>>>>erorr:', error)
        toast.error('Failed to register. Please try again')
      }

      location.href = `${location.origin}/~`
    },
    [searchParams, login],
  )

  useEffect(() => {
    if (inited.current) return
    inited.current = true
    loginWithEmail()
  }, [searchParams, loginWithEmail])

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center p-10">
      <div className="text-3xl font-bold">Creating new PenX account...</div>

      <div className="mt-6 flex items-center justify-center">
        <LoadingDots className="bg-foreground" />
      </div>
    </div>
  )
}
