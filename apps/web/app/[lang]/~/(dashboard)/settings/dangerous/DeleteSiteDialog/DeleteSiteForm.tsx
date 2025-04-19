'use client'

import { useForm } from 'react-hook-form'
import { PlateEditor } from '@penx/uikit/editor/plate-editor'
import { FileUpload } from '@/components/FileUpload'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { useSession } from '@/components/session'
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
import { trpc } from '@penx/trpc-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'

const FormSchema = z.object({
  text: z.string().regex(/delete my site/, {
    message: 'Text must contain the phrase "delete my site"',
  }),
})

interface Props {}

export function DeleteSiteForm() {
  const { isPending, mutateAsync } = trpc.site.deleteSite.useMutation()
  const { logout } = useSession()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      text: '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await mutateAsync()
      await logout()
      toast.success('Site delete successfully!')
      location.href = '/'
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
          name="text"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormDescription>
                Type <strong>delete my site</strong> to confirm.
              </FormDescription>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button
            variant="destructive"
            size="lg"
            type="submit"
            className="w-20"
          >
            {isPending ? <LoadingDots /> : <p>Save</p>}
          </Button>
        </div>
      </form>
    </Form>
  )
}
