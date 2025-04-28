'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trans } from '@lingui/react'
import { toast } from 'sonner'
import { z } from 'zod'
import { useRouter } from '@penx/libs/i18n'
import { useSession } from '@penx/session'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { Button } from '@penx/uikit/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@penx/uikit/form'
import { Input } from '@penx/uikit/input'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { useAuthStatus } from './useAuthStatus'
import { useLoginDialog } from './useLoginDialog'

const FormSchema = z.object({
  name: z.string().min(4, {
    message: 'Username must be at least 4 characters.',
  }),
  password: z.string().min(4, {
    message: 'Password must be at least 4 characters.',
  }),
})

interface Props {}

export function LoginForm({}: Props) {
  const [isLoading, setLoading] = useState(false)
  const { setIsOpen } = useLoginDialog()
  const { setAuthStatus } = useAuthStatus()
  const { login } = useSession()
  const { push } = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)

      const result = await login({
        type: 'password',
        username: data.name,
        password: data.password,
      })

      console.log('=====result:', result)
      push('/~')
      setIsOpen(false)
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
                <Input
                  placeholder="Username or email"
                  {...field}
                  className="w-full"
                />
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
            {isLoading ? <LoadingDots /> : <Trans id="Log in"></Trans>}
          </Button>
        </div>
      </form>

      <div className="text-center text-sm">
        <Trans id="No account"></Trans>?{' '}
        <a
          href="#"
          className="text-brand"
          onClick={() => setAuthStatus('register')}
        >
          <Trans id="Create one"></Trans>
        </a>
      </div>
    </Form>
  )
}
