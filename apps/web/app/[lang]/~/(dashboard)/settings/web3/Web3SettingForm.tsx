'use client'

import { useForm } from 'react-hook-form'
import { LoadingDots } from '@/components/icons/loading-dots'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@penx/ui/components/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@penx/ui/components/form'
import { Input } from '@penx/ui/components/input'
import { useSite } from '@/hooks/useSite'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { trpc } from '@/lib/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { Site } from '@penx/db/client'
import { toast } from 'sonner'
import { z } from 'zod'

const FormSchema = z.object({
  spaceId: z.string().optional(),
})

interface Props {}

export function Web3SettingForm({}: Props) {
  const { refetch } = useSite()
  const site = useSiteContext()
  const { isPending, mutateAsync } = trpc.site.updateSite.useMutation()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      spaceId: site.spaceId || '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await mutateAsync({
        id: site.id,
        spaceId: data.spaceId,
      })
      refetch()
      toast.success('Updated successfully!')
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
          name="spaceId"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Space ID</FormLabel>
              <FormDescription>
                Create a space to get a Space ID in: https://www.penx.io
              </FormDescription>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
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
