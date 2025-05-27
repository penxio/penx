'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { set } from 'idb-keyval'
import { toast } from 'sonner'
import { z } from 'zod'
import { appEmitter } from '@penx/emitter'
import { useAuthStatus } from '@penx/hooks/useAuthStatus'
import { queryClient } from '@penx/query-client'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@penx/uikit/form'
import { Input } from '@penx/uikit/input'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { useNavContext } from '../NavContext'

const FormSchema = z.object({
  name: z.string().email(),
  password: z.string().min(4, {
    message: 'Password must be at least 4 characters.',
  }),
})

interface Props {}

export function LoginForm({}: Props) {
  const [isLoading, setLoading] = useState(false)
  const { login } = useSession()
  const { setAuthStatus } = useAuthStatus()
  const nav = useNavContext()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log('=====>>>>>>>nav:', nav)

    try {
      setLoading(true)

      const session = await login({
        type: 'password',
        username: data.name,
        password: data.password,
      })

      console.log('=====result:', session)
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input placeholder={t`Email`} {...field} className="w-full" />
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
              <FormControl>
                <Input
                  autoComplete="current-password"
                  type="password"
                  placeholder={t`Password`}
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
            {isLoading ? <LoadingDots /> : <Trans>Log in</Trans>}
          </Button>
        </div>
      </form>

      <div className="pt-4 text-center text-sm">
        <Trans>No account</Trans>?{' '}
        <span
          className="text-brand"
          onClick={() => setAuthStatus({ type: 'register' })}
        >
          <Trans>Create one</Trans>
        </span>
      </div>
    </Form>
  )
}
