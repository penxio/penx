'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { LoadingDots } from '@/components/icons/loading-dots'
import { useLoginDialog } from '@/components/LoginDialog/useLoginDialog'
import { useSession } from '@/components/session'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { Site } from '@/lib/theme.types'
import { api } from '@/lib/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trans } from '@lingui/react/macro'
import { toast } from 'sonner'
import { z } from 'zod'
import { useSubscribeNewsletterDialog } from './useSubscribeNewsletterDialog'

const FormSchema = z.object({
  email: z.string().email(),
})

interface Props {
  site: Site
}

export function SubscribeNewsletterForm({ site }: Props) {
  const [isLoading, setLoading] = useState(false)
  const { setIsOpen } = useSubscribeNewsletterDialog()
  const loginDialog = useLoginDialog()
  const { data: session } = useSession()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!session) {
      loginDialog.setIsOpen(true)
      setIsOpen(false)
      return
    }
    try {
      setLoading(true)

      await api.subscriber.addSubscriber.mutate({
        siteId: site.id,
        email: data.email,
        source: 'user',
      })

      toast.success(<Trans>Subscribed successfully!</Trans>)
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
        <div className="flex flex-col items-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={site.logo || ''} />
            <AvatarFallback>{site?.name.slice(0, 1)}</AvatarFallback>
          </Avatar>

          <div className="mt-6 text-2xl font-semibold">
            <Trans>Subscribe to</Trans> {site.name}
          </div>
          <div className="text-foreground/60 w-8/12 text-center">
            <Trans>
              By subscribing, you'll receive the latest posts directly in your
              inbox.
            </Trans>
          </div>
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                <Trans>Your email</Trans>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="hello@penx.io"
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
            {isLoading ? (
              <LoadingDots />
            ) : (
              <p>
                <Trans>Subscribe</Trans>
              </p>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
