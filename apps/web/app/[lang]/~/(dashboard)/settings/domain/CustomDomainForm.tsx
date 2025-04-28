'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Site } from '@penx/db/client'
import { toast } from 'sonner'
import { z } from 'zod'
import { usePlanListDialog } from '@penx/components/PlanList/usePlanListDialog'
import { useDomains } from '@penx/hooks/useDomains'
import { useSite } from '@penx/hooks/useSite'
import { getSiteCustomDomain, SiteWithDomains } from '@penx/libs/getSiteDomain'
import { useSession } from '@penx/session'
import { trpc } from '@penx/trpc-client'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
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

const FormSchema = z.object({
  domain: z
    .string()
    .regex(
      /^[a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,6}$/,
      'Invalid domain format',
    ),
})

interface Props {
  site: SiteWithDomains
}

export function CustomDomainForm({ site }: Props) {
  const { session } = useSession()
  const { refetch } = useSite()
  const { isPending, mutateAsync } = trpc.site.customDomain.useMutation()
  const { setIsOpen } = usePlanListDialog()
  const { data } = useDomains()
  const customDomain = getSiteCustomDomain(data)

  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      domain: customDomain,
    },
    resolver: zodResolver(FormSchema),
  })

  const domain = form.watch('domain')

  useEffect(() => {
    if (domain !== domain.toLowerCase()) {
      form.setValue('domain', domain.toLowerCase())
    }
  }, [domain, form])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (session?.isFree) return setIsOpen(true)

    try {
      await mutateAsync({
        siteId: site.id,
        domain: data.domain,
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
        <div className="text-2xl font-bold">Custom domain</div>
        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Custom domain</FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  pattern="[a-zA-Z0-9\-\.]+"
                  maxLength={100}
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormDescription>
                The custom domain for your site.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-24" disabled={isPending}>
          {isPending ? <LoadingDots /> : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}
