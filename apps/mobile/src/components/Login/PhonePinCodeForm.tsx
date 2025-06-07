'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trans } from '@lingui/react/macro'
import { set } from 'idb-keyval'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'
import { appEmitter } from '@penx/emitter'
import { useAuthStatus } from '@penx/hooks/useAuthStatus'
import { localDB } from '@penx/local-db'
import { queryClient } from '@penx/query-client'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@penx/uikit/form'
import { Input } from '@penx/uikit/input'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@penx/uikit/ui/input-otp'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { useNavContext } from '../NavContext'

const FormSchema = z.object({
  code: z.string(),
})

interface Props {}

export function PhonePinCodeForm({}: Props) {
  const { login } = useSession()
  const [isLoading, setLoading] = useState(false)
  const { authStatus, setAuthStatus } = useAuthStatus()
  const nav = useNavContext()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)
      const session = await login({
        type: 'register-by-email-code',
        code: data.code,
      })
      console.log('=====session:', session)

      if (!session.isLoggedIn) {
        toast.error(session.message)
      } else {
        await set('SESSION', session)
        queryClient.setQueryData(['SESSION'], session)
        appEmitter.emit('APP_LOGIN_SUCCESS', session)
      }
    } catch (error) {
      console.log('========error:', error)
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }

    setLoading(false)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center gap-4"
      >
        <p className="text-foreground/80 text-sm">
          <Trans>Please enter the verification code.</Trans>
        </p>

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem className="">
              <FormControl>
                {/* <Input placeholder="" {...field} className="w-full" /> */}
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot className="size-12" index={0} />
                    <InputOTPSlot className="size-12" index={1} />
                    <InputOTPSlot className="size-12" index={2} />
                    <InputOTPSlot className="size-12" index={3} />
                    <InputOTPSlot className="size-12" index={4} />
                    <InputOTPSlot className="size-12" index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button size="xl" type="submit" disabled={isLoading} className="w-72">
            {isLoading ? <LoadingDots /> : <Trans>Log in</Trans>}
          </Button>
        </div>
      </form>

      <Button
        type="button"
        variant="ghost"
        size="xs"
        onClick={async () => {
          // try {
          //   await api.auth.registerByEmail.mutate(
          //     authStatus.data as any,
          //   )
          //   toast.success('Verification code sent successfully')
          // } catch (error) {
          //   console.log('========error:', error)
          //   const msg = extractErrorMessage(error)
          //   toast.error(msg)
          // }
        }}
      >
        <Trans>Resend</Trans>
      </Button>
    </Form>
  )
}
