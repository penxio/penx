'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { FileUpload } from '@penx/components/FileUpload'
import { Site } from '@penx/db/client'
import { useQuerySite } from '@penx/hooks/useQuerySite'
import { trpc } from '@penx/trpc-client'
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
import { LoadingDots } from '@penx/uikit/loading-dots'
import { Textarea } from '@penx/uikit/textarea'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'

const FormSchema = z.object({
  logo: z.string(),
  name: z.string().min(1, {
    message: 'Name must be at least 1 characters.',
  }),
  description: z.string(),
  about: z.string(),
})

interface Props {}

export function GeneralSettingForm({}: Props) {
  const { refetch } = useQuerySite()
  const { site } = useQuerySite()
  const { isPending, mutateAsync } = trpc.site.updateSite.useMutation()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      logo: site.logo || '',
      name: site.name || '',
      description: site.description || '',
      about: site.about,
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await mutateAsync({
        id: site.id,
        logo: data.logo,
        name: data.name,
        description: data.description,
        about: data.about,
      })
      refetch()
      toast.success('Site updated successfully!')
    } catch (error) {
      console.log('========error:', error)
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site logo</FormLabel>
              <FileUpload {...field} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Site name</FormLabel>
              <FormDescription>
                This is your public display site name.
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
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Site description</FormLabel>
              <FormDescription>
                A short description, used in your theme, meta data and search
                results
              </FormDescription>

              <FormControl>
                <Textarea placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button size="lg" type="submit" className="w-20">
            {isPending ? <LoadingDots /> : <p>Save</p>}
          </Button>
        </div>
      </form>
    </Form>
  )
}
