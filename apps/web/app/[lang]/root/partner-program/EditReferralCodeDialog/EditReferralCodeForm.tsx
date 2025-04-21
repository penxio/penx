'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { NumberInput } from '@penx/uikit/components/NumberInput'
import { Button } from '@penx/uikit/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@penx/uikit/ui/form'
import { Input } from '@penx/uikit/ui/input'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { api, trpc } from '@penx/trpc-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { slug } from 'github-slugger'
import { toast } from 'sonner'
import { z } from 'zod'
import { useEditReferralCodeDialog } from './useEditReferralCodeDialog'

const FormSchema = z.object({
  code: z
    .string()
    .min(4, { message: 'Code length should greater the three' })
    .max(10, { message: 'Code length should not exceed ten' }),
})

export function EditReferralCodeForm() {
  const [isLoading, setLoading] = useState(false)
  const { setIsOpen } = useEditReferralCodeDialog()
  const { data, refetch } = trpc.user.getReferralCode.useQuery()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: data || '',
    },
  })

  const slugValue = form.watch('code')

  useEffect(() => {
    if (slugValue === slug(slugValue).replace('-', '_')) return
    form.setValue('code', slug(slugValue).replace('-', '_'))
  }, [slugValue, form])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)
      await api.user.updateReferralCode.mutate({
        code: data.code,
      })
      await refetch()
      setIsOpen(false)
      toast.success('Update referral code successfully!')
    } catch (error) {
      console.log('======error:', error)
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
          name="code"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Referral code</FormLabel>
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
          {isLoading ? <LoadingDots /> : <div>Save</div>}
        </Button>
      </form>
    </Form>
  )
}
