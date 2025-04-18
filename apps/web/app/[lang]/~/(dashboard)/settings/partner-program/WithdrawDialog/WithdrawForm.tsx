'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { LoadingDots } from '@/components/icons/loading-dots'
import { NumberInput } from '@/components/NumberInput'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { api, trpc } from '@/lib/trpc'
import { toFloorFixed } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trans } from '@lingui/react/macro'
import { toast } from 'sonner'
import { z } from 'zod'
import { useWithdrawDialog } from './useWithdrawDialog'

const FormSchema = z.object({
  amount: z.string().min(1, { message: 'amount is required' }),
})

export function WithdrawForm() {
  const [isLoading, setLoading] = useState(false)
  const { setIsOpen } = useWithdrawDialog()
  const { data: balance, refetch } = trpc.affiliate.commissionBalance.useQuery()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      amount: '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)

      const amount = parseInt((Number(data.amount) * 100).toFixed(0))
      await api.payout.withdrawCommission.mutate({
        amount,
      })

      await refetch()
      setIsOpen(false)
      toast.success('Send withdrawal request successfully!')
    } catch (error) {
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
          name="amount"
          render={({ field }) => (
            <FormItem className="w-full">
              <div className="flex items-center justify-between">
                <FormLabel>
                  <Trans>Amount</Trans>
                </FormLabel>
                {balance && (
                  <div>
                    <Trans>Available</Trans>: $
                    {toFloorFixed(balance.withdrawable / 100, 2)}
                  </div>
                )}
              </div>
              <FormControl>
                <div className="relative">
                  <span className="text-foreground absolute left-3 top-2">
                    $
                  </span>
                  <NumberInput
                    placeholder="0.00"
                    precision={2}
                    {...field}
                    className="w-full pl-7"
                  />
                </div>
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
            <LoadingDots />
          ) : (
            <span>
              <Trans>Confirm</Trans>
            </span>
          )}
        </Button>
      </form>
    </Form>
  )
}
