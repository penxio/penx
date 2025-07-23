'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trans } from '@lingui/react/macro'
import ky from 'ky'
import { toast } from 'sonner'
import { z } from 'zod'
import { api } from '@penx/api'
import { useSettings } from '@penx/hooks/useSettings'
import {
  setSyncServerPassword,
  useSyncServerPassword,
} from '@penx/hooks/useSyncServerPassword'
import { localDB } from '@penx/local-db'
import { refreshSession, useSession } from '@penx/session'
import { Button } from '@penx/uikit/button'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@penx/uikit/form'
import { Input } from '@penx/uikit/input'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { useSyncServerDialog } from './useSyncServerDialog'

const FormSchema = z.object({
  host: z.string().url(),
  password: z.string().min(1),
})

type Data = z.infer<typeof FormSchema>

export function SyncServerForm() {
  const { session } = useSession()
  const { data: settings } = useSettings()
  const { data: password = '' } = useSyncServerPassword()
  const { setOpen } = useSyncServerDialog()
  const [loading, setLoading] = useState(false)

  const form = useForm<Data>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      host: session.syncServer?.host,
      password: password || '',
    },
  })

  async function onSubmit(data: Data) {
    setLoading(true)
    try {
      const shapeUrl = `${data.host}/shape?table=node&offset=-1`
      const res = await ky.get(shapeUrl).json()

      console.log('==========res:', res, 'settings:', settings)

      await api.updateSite({
        id: session.spaceId,
        syncServer: {
          host: data.host,
          enabled: false,
        },
      })

      await setSyncServerPassword(session.spaceId, data.password)
      await refreshSession()

      setOpen(false)
      toast.success('Save successfully!')
    } catch (error) {
      console.log('========error:', error)
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }

    setLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="host"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                <Trans>Sync server host</Trans>
              </FormLabel>
              <FormDescription>
                <Trans>Your sync server host, e.g. https://sync.penx.io</Trans>
              </FormDescription>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
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
              <FormDescription>
                <Trans>
                  Password for sync server, password is stored locally only.
                </Trans>
              </FormDescription>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-1">
          <Button
            size="lg"
            type="submit"
            className="w-32"
            disabled={!form.formState.isValid || loading}
          >
            {loading ? (
              <LoadingDots className="bg-background" />
            ) : (
              <Trans>Save</Trans>
            )}
          </Button>

          <Button size="lg" variant="secondary" type="button">
            <Trans>Test connection</Trans>
          </Button>
        </div>
      </form>
    </Form>
  )
}
