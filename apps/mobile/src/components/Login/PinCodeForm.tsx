'use client'

import { useState } from 'react'
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

export function PinCodeForm({}: Props) {
  const { login } = useSession()
  const [isLoading, setLoading] = useState(false)
  const { authStatus } = useAuthStatus()
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-foreground/60">
          <Trans>Please check your email for the verification code.</Trans>
        </p>

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="flex items-center justify-between">
                <span>
                  <Trans>Login code</Trans>
                </span>
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
                  Resend
                </Button>
              </FormLabel>
              <FormControl>
                <Input size="xl" placeholder="" {...field} className="w-full" />
                {/* <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP> */}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button
            size="xl"
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? <LoadingDots /> : <Trans>Register</Trans>}
          </Button>
        </div>
      </form>
    </Form>
  )
}
