'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trans } from '@lingui/react/macro'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'
import { useAuthStatus } from '@penx/hooks/useAuthStatus'
import { db } from '@penx/pg'
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
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
})

interface Props {}

export function RegisterForm({}: Props) {
  const [isLoading, setLoading] = useState(false)
  const { setAuthStatus } = useAuthStatus()
  const searchParams = useSearchParams()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // try {
    //   const sites = await db.listAllSites()
    //   const site = sites.find((s) => !s.props.isRemote)
    //   const ref = searchParams?.get('ref') as string
    //   setLoading(true)
    //   await api.auth.registerByEmail.mutate({
    //     ...data,
    //     ref: ref || '',
    //     userId: site?.userId,
    //   })
    //   setAuthStatus({
    //     type: 'register-email-sent',
    //     data: {
    //       ...data,
    //       ref: ref || '',
    //       userId: site?.userId,
    //     },
    //   })
    // } catch (error) {
    //   console.log('========error:', error)
    //   const msg = extractErrorMessage(error)
    //   toast.error(msg)
    // }
    // setLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                <Trans>Email</Trans>
              </FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                <Trans>Password</Trans>
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Password"
                  {...field}
                  className="w-full"
                />
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

      <div className="mt-2 text-center text-sm">
        <Trans>Already have an account</Trans>?{' '}
        <a
          href="#"
          className="text-brand"
          onClick={() => setAuthStatus({ type: 'login' })}
        >
          <Trans>Log in</Trans>
        </a>
      </div>
    </Form>
  )
}
