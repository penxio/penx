'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trans } from '@lingui/react'
import { toast } from 'sonner'
import { z } from 'zod'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { api, trpc } from '@penx/trpc-client'
import { Button } from '@penx/uikit/button'
import { FileUpload } from '@penx/uikit/FileUpload'
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
import { LoadingDots } from '@penx/uikit/loading-dots'
import { Textarea } from '@penx/uikit/textarea'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { useSubmitFriendLinkDialog } from './useSubmitFriendLinkDialog'

const FormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  introduction: z.string().min(5, { message: 'Introduction too short' }),
  avatar: z.string().min(1, { message: 'Please upload your avatar' }),
  url: z.string().url(),
})

export function SubmitFriendLinkForm() {
  const [isLoading, setLoading] = useState(false)
  const site = useSiteContext()
  const { setIsOpen } = useSubmitFriendLinkDialog()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      introduction: '',
      avatar: '',
      url: '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)
      await api.page.submitFriendLink.mutate({
        siteId: site.id,
        data,
      })
      setIsOpen(false)
      toast.success(<Trans id="Submit successfully!"></Trans>)
    } catch (error) {
      console.log('=========error:', error)
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
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FileUpload saveToDB={false} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                <Trans id="Name"></Trans>
              </FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="introduction"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                <Trans id="Introduction"></Trans>
              </FormLabel>
              <FormControl>
                <Textarea placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                <Trans id="Link"></Trans>
              </FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button type="submit" className="w-24" disabled={isLoading}>
            {isLoading ? (
              <LoadingDots />
            ) : (
              <span>
                <Trans id="Submit"></Trans>
              </span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
