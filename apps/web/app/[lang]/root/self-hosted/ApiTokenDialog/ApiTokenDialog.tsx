'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { LoadingDots } from '@/components/icons/loading-dots'
import { Button } from '@penx/ui/components/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@penx/ui/components/dialog'
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
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { trpc } from '@/lib/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { useApiTokenDialog } from './useApiTokenDialog'

const FormSchema = z.object({
  apiToken: z.string().min(1, { message: 'API token is required' }),
})

interface Props {}

export function ApiTokenDialog({}: Props) {
  const { isOpen, setIsOpen } = useApiTokenDialog()
  const { isPending, mutateAsync } =
    trpc.hostedSite.updateCloudFlareApiToken.useMutation()
  const { data } = trpc.hostedSite.getCloudFlareApiToken.useQuery()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      apiToken: '',
    },
  })

  useEffect(() => {
    if (data) {
      form.setValue('apiToken', data)
    }
  }, [data, form])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await mutateAsync({ apiToken: data.apiToken })
      setIsOpen(false)
      toast.success('Updated API token successfully!')
    } catch (error) {
      console.log('error:', error)
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="grid gap-3 sm:max-w-[500px]">
        <DialogHeader className="">
          <DialogTitle className="text-3xl font-bold">
            Update API token
          </DialogTitle>
          <DialogDescription>
            Update your Cloudflare API token
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="apiToken"
              render={({ field }) => (
                <FormItem className="w-full">
                  <div className="flex items-center justify-between">
                    <FormLabel>API token</FormLabel>
                    <a
                      href="https://dash.cloudflare.com/profile/api-tokens?permissionGroupKeys=[%20%20{%20%20%20%20%22key%22:%20%22d1%22,%20%20%20%20%22type%22:%20%22edit%22%20%20},%20%20{%20%20%20%20%22key%22:%20%22workers_r2%22,%20%20%20%20%22type%22:%20%22edit%22%20%20},%20%20{%20%20%20%20%22key%22:%20%22workers_kv_storage%22,%20%20%20%20%22type%22:%20%22edit%22%20%20},%20%20{%20%20%20%20%22key%22:%20%22page%22,%20%20%20%20%22type%22:%20%22edit%22%20%20},%20%20{%20%20%20%20%22key%22:%20%22ai%22,%20%20%20%20%22type%22:%20%22read%22%20%20},%20%20{%20%20%20%22key%22:%22workers_scripts%22,%20%20%20%22type%22:%20%22edit%22%20%20},%20%20{%20%20%20%20%22key%22:%20%22account_settings%22,%20%20%20%20%22type%22:%20%22read%22%20%20}%20%20]&name=PenX"
                      target="_blank"
                      className="text-foreground/60 hover:text-foreground/90 flex items-center gap-1 text-sm transition-all hover:scale-105"
                    >
                      Create API Token
                      <ExternalLink size={16}></ExternalLink>
                    </a>
                  </div>
                  <FormControl>
                    <Input placeholder="" {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between gap-3">
              <DialogClose asChild className="w-full">
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <LoadingDots className="" /> : 'Update'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
