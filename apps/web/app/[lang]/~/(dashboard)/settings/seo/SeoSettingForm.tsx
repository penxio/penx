'use client'

import { useForm } from 'react-hook-form'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { Button } from '@penx/uikit/button'
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
import { Textarea } from '@penx/uikit/textarea'
import { useSite } from '@penx/hooks/useSite'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { trpc } from '@penx/trpc-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Site } from '@penx/db/client'
import { toast } from 'sonner'
import { z } from 'zod'

const FormSchema = z.object({
  title: z.string(),
  description: z.string(),
})

interface Props {
  site: Site
}

export function SeoSettingForm({ site }: Props) {
  const { refetch } = useSite()
  const { isPending, mutateAsync } = trpc.site.updateSite.useMutation()
  const { seo } = (site.config || {}) as {
    seo: z.infer<typeof FormSchema>
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      title: seo?.title || '',
      description: seo?.description || '',
    },
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await mutateAsync({
        id: site.id,
        config: {
          ...(site.config as any),
          seo: data,
        },
      })
      refetch()
      toast.success('Save successfully!')
    } catch (error) {
      console.log('========error:', error)
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
  }

  return (
    <Form {...form}>
      <div className="text-xl font-bold">SEO meta data</div>
      <div className="text-foreground/50 mb-6">
        SEO-enhanced content for search engines.
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Meta title</FormLabel>
              <FormDescription>Recommended: 70 characters</FormDescription>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Meta description</FormLabel>
              <FormDescription>Recommended: 156 characters</FormDescription>
              <FormControl>
                <Textarea placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-24" disabled={isPending}>
          {isPending ? <LoadingDots /> : 'Save'}
        </Button>
      </form>
    </Form>
  )
}
