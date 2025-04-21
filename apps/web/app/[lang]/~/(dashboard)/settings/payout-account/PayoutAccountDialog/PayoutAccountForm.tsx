'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trans } from '@lingui/react'
import { TransferMethod } from '@prisma/client'
import { toast } from 'sonner'
import { z } from 'zod'
import { api, trpc } from '@penx/trpc-client'
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
import { ToggleGroup, ToggleGroupItem } from '@penx/uikit/ui/toggle-group'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { usePayoutAccountDialog } from './usePayoutAccountDialog'

const FormSchema = z.object({
  address: z.string().min(1, { message: 'Address is required' }),
  transferMethod: z.nativeEnum(TransferMethod),
})

export function PayoutAccountForm() {
  const [isLoading, setLoading] = useState(false)
  const { setIsOpen, payoutAccount, index } = usePayoutAccountDialog()
  const { refetch } = trpc.payoutAccount.list.useQuery()
  const isEdit = !!payoutAccount

  const info: any = payoutAccount?.info

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      transferMethod: isEdit
        ? payoutAccount.transferMethod
        : TransferMethod.WALLET,
      address: isEdit ? info.address : '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)

      const { address, transferMethod } = data
      if (isEdit) {
        await api.payoutAccount.update.mutate({
          id: payoutAccount.id,
          transferMethod,
          info: {
            address,
          },
        })
      } else {
        await api.payoutAccount.create.mutate({
          transferMethod,
          info: {
            address,
          },
        })
      }
      await refetch()
      form.reset()
      setIsOpen(false)
      toast.success(
        isEdit
          ? 'Payout account updated successfully!'
          : 'Payout account added successfully!',
      )
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
          name="transferMethod"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Transfer method</FormLabel>
              <FormDescription>
                PenX currently only supports withdrawals to crypto wallet.
              </FormDescription>
              <FormControl>
                <ToggleGroup
                  className="w-auto"
                  size="lg"
                  value={field.value}
                  onValueChange={(v) => {
                    if (!v) return
                    field.onChange(v)
                  }}
                  type="single"
                >
                  <ToggleGroupItem className="" value={TransferMethod.WALLET}>
                    <Trans id="Wallet"></Trans>
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    disabled
                    className=""
                    value={TransferMethod.BLANK}
                  >
                    <Trans id="Bank"></Trans>
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    disabled
                    className=""
                    value={TransferMethod.PAYPAL}
                  >
                    <Trans id="Paypal"></Trans>
                  </ToggleGroupItem>
                </ToggleGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="0x..." {...field} className="w-full" />
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
            <span>{isEdit ? 'Save' : 'Confirm'}</span>
          )}
        </Button>
      </form>
    </Form>
  )
}
