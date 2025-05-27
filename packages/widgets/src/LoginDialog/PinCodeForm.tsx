'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trans } from '@lingui/react/macro'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'
import { useAuthStatus } from '@penx/hooks/useAuthStatus'
import { localDB } from '@penx/local-db'
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@penx/uikit/ui/input-otp'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { useLoginDialog } from './useLoginDialog'

const FormSchema = z.object({
  code: z.string(),
})

interface Props {}

export function PinCodeForm({}: Props) {
  const { login } = useSession()
  const [isLoading, setLoading] = useState(false)
  const { authStatus } = useAuthStatus()
  const { setIsOpen } = useLoginDialog()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)
      const result = await login({
        type: 'register-by-code',
        code: data.code,
      })
      console.log('=====session:', result)

      if (!result.isLoggedIn) {
        toast.error(result.message)
      } else {
        location.reload()
        setIsOpen(false)
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
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button
            size="lg"
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
