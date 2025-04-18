'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { LoadingDots } from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
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
import { useCoupons } from '@/hooks/useCoupons'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { api } from '@/lib/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'

const numberRegex = /^[0-9]*$/

const FormSchema = z.object({
  months: z.string().min(1).regex(numberRegex, { message: 'Invalid months' }),
  amount: z.string().min(1).regex(numberRegex, { message: 'Invalid amount' }),
})

export function CreateCouponForm() {
  const [isLoading, setLoading] = useState(false)
  const { refetch } = useCoupons()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      months: '',
      amount: '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)

      await api.coupon.batchCreate.mutate({
        months: Number(data.months),
        amount: Number(data.amount),
      })

      refetch()

      toast.success('Create coupons successfully!')
    } catch (error) {
      console.log('error:', error)

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
          name="months"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Months</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Amount</FormLabel>
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
          {isLoading ? (
            <LoadingDots className="bg-background" />
          ) : (
            <p>Create coupons</p>
          )}
        </Button>
      </form>
    </Form>
  )
}
