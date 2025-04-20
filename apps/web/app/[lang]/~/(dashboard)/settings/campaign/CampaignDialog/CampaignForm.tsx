'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FileUpload } from '@penx/components/FileUpload'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { NumberInput } from '@penx/components/NumberInput'
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
import { Textarea } from '@penx/uikit/ui/textarea'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { api, trpc } from '@penx/trpc-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { useCampaignDialog } from './useCampaignDialog'

const FormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  goal: z.string().min(1, { message: 'Price is required' }),
  details: z.any().optional(),
  image: z.any().optional(),
})

export function CampaignForm() {
  const [isLoading, setLoading] = useState(false)
  const { setIsOpen, campaign: campaign } = useCampaignDialog()
  const { refetch } = trpc.campaign.myCampaign.useQuery()
  const isEdit = !!campaign

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: isEdit ? campaign.name : '',
      description: isEdit ? campaign.description : '',
      goal: isEdit ? (campaign.goal / 100).toFixed(2) : '',
      details: isEdit ? campaign.details : '',
      image: isEdit ? campaign.image : '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)

      if (isEdit) {
        const { goal, ...rest } = data
        await api.campaign.update.mutate({
          id: campaign.id,
          ...rest,
        })
      } else {
        await api.campaign.create.mutate({
          ...data,
          goal: parseInt((Number(data.goal) * 100) as any),
        })
      }
      await refetch()
      form.reset()
      setIsOpen(false)
      toast.success(
        isEdit
          ? 'Campaign updated successfully!'
          : 'Campaign created successfully!',
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
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FileUpload {...field} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="goal"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Goal</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="text-foreground absolute left-3 top-2">
                    $
                  </span>
                  <NumberInput
                    disabled={isEdit}
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

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !form.formState.isValid}
        >
          {isLoading ? (
            <LoadingDots />
          ) : (
            <span>{isEdit ? 'Save' : 'Create'}</span>
          )}
        </Button>
      </form>
    </Form>
  )
}
