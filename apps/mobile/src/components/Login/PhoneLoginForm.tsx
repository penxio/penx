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
import { localDB } from '@penx/local-db'
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

interface Props {}

export function PhoneLoginForm({}: Props) {
  const FormSchema = z.object({
    phone: z.string().regex(/^1[3-9]\d{9}$/, {
      message: t`Invalid phone number.`,
    }),
  })

  const [isLoading, setLoading] = useState(false)
  const { login } = useSession()
  const { setAuthStatus } = useAuthStatus()
  const nav = useNavContext()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      phone: '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log('=====>>>>>>>nav:', nav)

    try {
      setLoading(true)
      const sites = await localDB.listAllSites()
      const site = sites.find((s) => !s.props.isRemote)

      setAuthStatus({
        type: 'sms-code-sent',
        data: {
          ...data,
          userId: site?.userId!,
        },
      })
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
          name="phone"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  autoFocus
                  size="xl"
                  placeholder={t`Phone number`}
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
            size="xl"
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? <LoadingDots /> : <Trans>Log in</Trans>}
          </Button>
        </div>
      </form>
    </Form>
  )
}
