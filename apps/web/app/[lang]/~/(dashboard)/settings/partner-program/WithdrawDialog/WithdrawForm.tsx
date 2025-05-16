'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trans } from '@lingui/react'
import { toast } from 'sonner'
import { z } from 'zod'
import { api, trpc } from '@penx/trpc-client'
import { Button } from '@penx/uikit/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@penx/uikit/form'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { NumberInput } from '@penx/uikit/NumberInput'
import { toFloorFixed } from '@penx/utils'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
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
                  <Trans id="Amount"></Trans>
                </FormLabel>
                {balance && (
                  <div>
                    <Trans id="Available"></Trans>: $
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
              <Trans id="Confirm"></Trans>
            </span>
          )}
        </Button>
      </form>
    </Form>
  )
}
