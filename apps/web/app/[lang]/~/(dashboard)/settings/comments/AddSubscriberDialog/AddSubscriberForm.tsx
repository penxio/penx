'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@penx/uikit/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@penx/uikit/ui/form'
import { Input } from '@penx/uikit/ui/input'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { api } from '@penx/trpc-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { useAddSubscriberDialog } from './useAddSubscriberDialog'

const FormSchema = z.object({
  emails: z.string().min(1, { message: 'email is required' }),
})

export function AddSubscriberForm() {
  const [isLoading, setLoading] = useState(false)
  const { setIsOpen } = useAddSubscriberDialog()
  const site = useSiteContext()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      emails: '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)
      const emails = data.emails
        .split(',')
        .map((email) => email.trim())
        .filter(Boolean)

      await api.subscriber.create.mutate({
        siteId: site.id,
        emails,
      })
      setIsOpen(false)
      setTimeout(() => {
        toast.success('Add subscribers successfully!')
      }, 300)
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg || 'Failed to add subscribers. Please try again.')
    }
    setLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="emails"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Add subscribers by email address</FormLabel>
              <FormDescription>
                Support multiple email addresses separated by commas.
              </FormDescription>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !form.formState.isValid}
        >
          {isLoading ? <LoadingDots /> : <p>Add</p>}
        </Button>
      </form>
    </Form>
  )
}
