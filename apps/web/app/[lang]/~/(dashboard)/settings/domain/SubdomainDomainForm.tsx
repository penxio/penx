'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { slug } from 'github-slugger'
import { toast } from 'sonner'
import { z } from 'zod'
import { Site } from '@penx/db/client'
import { useDomains } from '@penx/hooks/useDomains'
import { useQuerySite } from '@penx/hooks/useQuerySite'
import { getSiteSubdomain, SiteWithDomains } from '@penx/libs/getSiteDomain'
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
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'

const FormSchema = z.object({
  domain: z.string().min(2, {
    message: 'Subdomain should be at least 2 characters long.',
  }),
})

interface Props {
  site: SiteWithDomains
}

export function SubdomainDomainForm({ site }: Props) {
  const { isPending, mutateAsync } = trpc.site.addSubdomain.useMutation()

  const { refetch } = trpc.site.listSiteSubdomains.useQuery({
    siteId: site.id,
  })

  const { data } = useDomains()
  const subdomain = getSiteSubdomain(data)
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      domain: subdomain,
    },
    resolver: zodResolver(FormSchema),
  })

  const domain = form.watch('domain')

  useEffect(() => {
    if (domain !== slug(domain)) {
      form.setValue('domain', slug(domain))
    }
  }, [domain, form])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await mutateAsync({
        siteId: site.id,
        domain: data.domain,
      })
      refetch()
      toast.success('Add subdomain successfully!')
    } catch (error) {
      console.log('========error:', error)
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="text-2xl font-bold">Add subdomain</div>

        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Subdomain</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Subdomain"
                    pattern="[a-zA-Z0-9\-]+"
                    maxLength={100}
                    {...field}
                    className="w-full"
                  />

                  <div className="text-secondary-foreground absolute right-2 top-2">
                    .{process.env.NEXT_PUBLIC_ROOT_DOMAIN}
                  </div>
                </div>
              </FormControl>
              <FormDescription>The subdomain for your site.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-36" disabled={isPending}>
          {isPending ? <LoadingDots /> : 'Add subdomain'}
        </Button>
      </form>
    </Form>
  )
}
