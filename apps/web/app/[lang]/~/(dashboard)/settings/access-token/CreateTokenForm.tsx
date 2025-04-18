'use client'

import { useForm } from 'react-hook-form'
import { LoadingDots } from '@/components/icons/loading-dots'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAccessTokens } from '@/hooks/useAccessTokens'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { trpc } from '@/lib/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'

const FormSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters long.',
  }),
  expiredAt: z.union([z.date(), z.undefined()]).optional(),
})

export function CreateTokenForm() {
  const { refetch } = useAccessTokens()
  const site = useSiteContext()
  const { mutateAsync, isPending } = trpc.accessToken.create.useMutation()

  const now = new Date()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      expiredAt: new Date(now.setDate(now.getDate() + 7)),
    },
  })
  const expiredAtValue = form.watch('expiredAt')

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await mutateAsync({
        ...data,
        siteId: site.id,
      })
      refetch()
      toast.success('Access token created successfully.')
      form.reset()
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Create a new access token</CardTitle>
            </CardHeader>

            <CardContent className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter token name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This helps to identify and differentiate your tokens.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiredAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usage period</FormLabel>
                    <Select
                      defaultValue="no-expiry"
                      onValueChange={(value) => {
                        const now = new Date()
                        let expirationDate

                        if (value === '1w') {
                          expirationDate = new Date(
                            now.setDate(now.getDate() + 7),
                          )
                        } else if (value === '1m') {
                          expirationDate = new Date(
                            now.setMonth(now.getMonth() + 1),
                          )
                        } else if (value === '1y') {
                          expirationDate = new Date(
                            now.setFullYear(now.getFullYear() + 1),
                          )
                        } else {
                          expirationDate = undefined
                        }

                        if (value === 'no-expiry') {
                          form.setValue('expiredAt', undefined)
                        } else {
                          form.setValue('expiredAt', expirationDate)
                        }

                        field.onChange(expirationDate)
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select usage period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1w">One Week</SelectItem>
                        <SelectItem value="1m">One Month</SelectItem>
                        <SelectItem value="1y">One Year</SelectItem>
                        <SelectItem value="no-expiry">No Expiry</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {expiredAtValue === undefined
                        ? 'Token has no expiry date.'
                        : `Token will expire on ${expiredAtValue.toLocaleDateString()}.`}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isPending} className="w-44">
                {isPending ? (
                  <LoadingDots className="bg-background" />
                ) : (
                  'Create access token'
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
