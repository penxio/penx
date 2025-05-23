'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { defaultEditorContent } from '@penx/constants'
import { PlateEditor } from '@penx/editor/plate-editor'
import { api, trpc } from '@penx/trpc-client'
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
import { NumberInput } from '@penx/uikit/NumberInput'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { useTierPriceDialog } from './useTierPriceDialog'

const FormSchema = z.object({
  price: z.string().min(1, { message: 'Price is required' }),
})

export function TierPriceForm() {
  const [isLoading, setLoading] = useState(false)
  const { setIsOpen, tier } = useTierPriceDialog()
  const { refetch } = trpc.tier.listSiteTiers.useQuery()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      price: (tier?.price / 100).toString() || '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)
      await api.product.updatePrice.mutate({
        id: tier.id,
        price: data.price,
      })

      await refetch()

      setIsOpen(false)
      toast.success('Price updated successfully!')
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
          name="price"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Monthly price</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="text-foreground absolute left-3 top-2">
                    $
                  </span>
                  <NumberInput
                    placeholder=""
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

        <div>
          <Button
            type="submit"
            className="w-24"
            disabled={isLoading || !form.formState.isValid}
          >
            {isLoading ? <LoadingDots /> : <span>Update</span>}
          </Button>
        </div>
      </form>
    </Form>
  )
}
